import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY as string;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── Parseo del archivo (misma lógica que build-socios-data.cjs) ───────────

interface SocioRow {
  dni_norm: string;
  nro_socio_norm: string;
  nombre: string;
  nro_socio_display: string;
  plan?: string;
  domicilio?: string;
  ctas_debe?: string;
}

function normalizeDoc(raw: string): string | null {
  const t = raw.trim();
  if (!t || /^null$/i.test(t)) return null;
  const digits = t.split(",")[0].replace(/\D/g, "");
  if (!digits || digits.length < 6) return null;
  return digits.replace(/^0+/, "") || "0";
}

function normalizeSocio(raw: string): string | null {
  const t = raw.trim();
  if (!t || /^null$/i.test(t)) return null;
  const digits = t.replace(/\D/g, "");
  return digits.length ? digits : null;
}

function cleanCell(raw: string): string {
  const t = raw.trim();
  if (!t || /^null$/i.test(t)) return "";
  return t.replace(/\s+/g, " ");
}

function parseFileContent(text: string): SocioRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const records: SocioRow[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && /NROSOCIO/i.test(line) && /NRODOC/i.test(line)) continue;

    const cols = line.split(";");
    if (cols.length < 11) continue;

    const nroSocioRaw = cols[0]?.trim() ?? "";
    const nombre = (cols[2] ?? "").trim();
    const domicilioRaw = cols[3] ?? "";
    const nroDocRaw = cols[4]?.trim() ?? "";
    const planNuevo = (cols[7] ?? "").trim();
    const ctasDebeRaw = cols[10] ?? "";

    const dniNorm = normalizeDoc(nroDocRaw);
    const nroSocioNorm = normalizeSocio(nroSocioRaw);
    if (!dniNorm || !nroSocioNorm || !nombre) continue;

    const key = `${dniNorm}|${nroSocioNorm}`;
    if (seen.has(key)) continue;
    seen.add(key);

    records.push({
      dni_norm: dniNorm,
      nro_socio_norm: nroSocioNorm,
      nombre: nombre.replace(/\s+/g, " "),
      nro_socio_display: nroSocioRaw,
      plan: planNuevo && !/^null$/i.test(planNuevo) ? planNuevo : undefined,
      domicilio: cleanCell(domicilioRaw) || undefined,
      ctas_debe: cleanCell(ctasDebeRaw) || undefined,
    });
  }

  return records;
}

// ─── Upload a Supabase ──────────────────────────────────────────────────────

async function uploadToSupabase(
  records: SocioRow[],
  onProgress: (msg: string) => void
): Promise<void> {
  onProgress("Eliminando registros anteriores...");
  const { error: delError } = await supabase.from("socios").delete().gt("id", 0);
  if (delError) throw new Error(`Error al eliminar: ${delError.message}`);

  const BATCH = 500;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const { error } = await supabase.from("socios").insert(batch);
    if (error) throw new Error(`Error al insertar registros: ${error.message}`);
    onProgress(`Subiendo... ${Math.min(i + BATCH, records.length)} de ${records.length}`);
  }
}

// ─── Componente principal ───────────────────────────────────────────────────

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [records, setRecords] = useState<SocioRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Contraseña incorrecta.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setRecords(null);
    setResult(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (ev) => {
      const bytes = new Uint8Array(ev.target!.result as ArrayBuffer);
      const text = new TextDecoder("latin1").decode(bytes);
      const parsed = parseFileContent(text);
      setRecords(parsed);
    };
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (fileRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
      fileRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  async function handleUpload() {
    if (!records?.length) return;
    setUploading(true);
    setResult(null);
    try {
      await uploadToSupabase(records, setProgress);
      setResult({
        ok: true,
        message: `✓ ${records.length.toLocaleString("es-AR")} socios actualizados correctamente.`,
      });
      setRecords(null);
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido.";
      setResult({ ok: false, message: `✗ ${msg}` });
    } finally {
      setUploading(false);
      setProgress("");
    }
  }

  // ── Pantalla de login ──
  if (!authenticated) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.logo}>🏥</div>
          <h1 style={s.title}>HESM Admin</h1>
          <p style={s.subtitle}>Panel de actualización de socios</p>
          <form onSubmit={handlePasswordSubmit} style={s.form}>
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={s.input}
              autoFocus
            />
            {passwordError && <p style={s.errorText}>{passwordError}</p>}
            <button type="submit" style={s.btn}>
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Pantalla de carga ──
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🏥</div>
        <h1 style={s.title}>HESM Admin</h1>
        <p style={s.subtitle}>Actualización del padrón de socios</p>

        <div
          style={s.dropZone}
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".xls,.xlsx,.csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <span style={{ fontSize: 32 }}>📂</span>
          <p style={s.dropText}>
            {fileName
              ? `📄 ${fileName}`
              : "Hacé clic o arrastrá el archivo de socios (.xls)"}
          </p>
        </div>

        {records !== null && (
          <div style={s.preview}>
            <span style={{ color: "#00666e", fontWeight: 700, fontSize: 15 }}>
              ✓ {records.length.toLocaleString("es-AR")} socios encontrados en el archivo
            </span>
          </div>
        )}

        {uploading && progress && (
          <p style={{ color: "#666", fontSize: 13, textAlign: "center", margin: 0 }}>
            {progress}
          </p>
        )}

        {result && (
          <div
            style={{
              ...s.resultBox,
              borderColor: result.ok ? "#00666e" : "#dc2626",
              color: result.ok ? "#00666e" : "#dc2626",
              background: result.ok ? "#f0fafa" : "#fff5f5",
            }}
          >
            {result.message}
          </div>
        )}

        <button
          style={{
            ...s.btn,
            opacity: !records?.length || uploading ? 0.45 : 1,
            cursor: !records?.length || uploading ? "not-allowed" : "pointer",
          }}
          disabled={!records?.length || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Actualizando..." : "Actualizar socios en la app"}
        </button>

        <p style={s.hint}>
          Este proceso reemplaza todos los socios en la base de datos. La app refleja los cambios de forma inmediata.
        </p>
      </div>
    </div>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────────

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#edf7f8",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "24px 16px",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 460,
    boxShadow: "0 8px 32px rgba(0,102,110,0.13)",
    display: "flex",
    flexDirection: "column" as const,
    gap: 18,
    alignItems: "stretch",
  },
  logo: {
    fontSize: 42,
    textAlign: "center" as const,
  },
  title: {
    margin: 0,
    color: "#00666e",
    fontSize: 26,
    fontWeight: 800,
    textAlign: "center" as const,
    letterSpacing: -0.5,
  },
  subtitle: {
    margin: 0,
    color: "#666",
    fontSize: 14,
    textAlign: "center" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  input: {
    padding: "13px 16px",
    borderRadius: 10,
    border: "1.5px solid #b3dde0",
    fontSize: 15,
    outline: "none",
    color: "#111",
  },
  btn: {
    padding: "14px",
    borderRadius: 10,
    background: "#00666e",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  errorText: {
    margin: 0,
    color: "#dc2626",
    fontSize: 13,
    fontWeight: 600,
  },
  dropZone: {
    border: "2.5px dashed #8ecfd3",
    borderRadius: 12,
    padding: "28px 20px",
    textAlign: "center" as const,
    cursor: "pointer",
    backgroundColor: "#f7fdfd",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 8,
  },
  dropText: {
    margin: 0,
    color: "#444",
    fontSize: 14,
    fontWeight: 500,
  },
  preview: {
    padding: "12px 16px",
    borderRadius: 10,
    background: "#f0fafa",
    border: "1.5px solid #b3dde0",
    textAlign: "center" as const,
  },
  resultBox: {
    padding: "14px 16px",
    borderRadius: 10,
    border: "1.5px solid",
    fontWeight: 600,
    fontSize: 14,
    textAlign: "center" as const,
  },
  hint: {
    margin: 0,
    color: "#999",
    fontSize: 12,
    textAlign: "center" as const,
    lineHeight: 1.5,
  },
} as const;

import React, { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, Search, UserRound, Sparkles } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { SearchBar } from "../../../components/ui/SearchBar";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";
import { useCartillaData } from "../../../hooks/useCartillaData";
import { useHesmRemoteStore } from "../../../state/useHesmRemoteStore";
import { makeWhatsAppUrl, openUrl } from "../../../utils/links";
import { useCurrentUser } from "../../../state/useAuthStore";
import type { Professional } from "../../../types/cartilla";
import { ListItem } from "../../../components/ui/ListItem";

function contains(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

export function CartillaMedica() {
  const router = useRouter();
  const { professionals, specialties } = useCartillaData();
  const { whatsappNumber } = useHesmContacts();
  const user = useCurrentUser();
  const isSyncing = useHesmRemoteStore((s) => s.isSyncing);
  const syncFromWeb = useHesmRemoteStore((s) => s.syncFromWeb);

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [professionalQuery, setProfessionalQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return professionals.filter((p) => {
      const matchesSpecialty = specialty ? p.specialty === specialty : true;

      const matchesProfessional = professionalQuery.trim()
        ? contains(p.name, professionalQuery)
        : true;

      const matchesSearch = q
        ? contains(`${p.name} ${p.specialty} ${p.observaciones ?? ""}`, q)
        : true;

      return matchesSpecialty && matchesProfessional && matchesSearch;
    }).sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [professionalQuery, professionals, search, specialty]);

  function whatsappFor(p: Professional) {
    const context = p.whatsappMessageContext ?? p.specialty;
    const nombre = user?.displayName ?? "";
    const dni = user?.emailOrDni ?? "";

    // WhatsApp respeta saltos de línea dentro del texto.
    const normalize = (v: string) =>
      v
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    const lineas: string[] = [
      `Hola, quiero solicitar turno para ${context} con ${p.name}.`,
    ];
    // Evita repetir el mismo nombre si coincide con el profesional.
    if (nombre && normalize(nombre) !== normalize(p.name)) lineas.push(`Nombre: ${nombre}`);
    if (dni) lineas.push(`DNI: ${dni}`);
    lineas.push("¿Podrían indicarme disponibilidad?");

    const mensaje = lineas.join("\n");

    return makeWhatsAppUrl(whatsappNumber, mensaje);
  }

  function clearFilters() {
    setSearch("");
    setProfessionalQuery("");
    setSpecialty(null);
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}
      refreshControl={
        <RefreshControl
          refreshing={isSyncing}
          onRefresh={() => void syncFromWeb({ force: true })}
          colors={[theme.colors.primary]}
        />
      }
    >
      <View style={{ gap: theme.spacing.md }}>
        <SectionTitle
          title="Cartilla médica"
          subtitle="Datos alineados a hesm.org; deslizá hacia abajo para actualizar."
        />

        <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por profesional o especialidad..."
            leftIcon={<Search size={18} color={theme.colors.primary} strokeWidth={2.2} />}
            accessibilityLabel="Buscar en cartilla"
          />

          <View style={{ gap: theme.spacing.md }}>
            <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, fontWeight: "800" }}>
              Especialidad
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={specialties}
              keyExtractor={(item) => item}
              contentContainerStyle={{ gap: theme.spacing.sm }}
              renderItem={({ item }) => {
                const selected = item === specialty;
                return (
                  <Pressable
                    onPress={() => setSpecialty(selected ? null : item)}
                    style={({ pressed }) => ({
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderRadius: 999,
                      backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
                      borderWidth: 1,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                      opacity: pressed ? 0.86 : 1,
                    })}
                  >
                    <Text style={{ fontWeight: "800", color: selected ? theme.colors.primaryDark : theme.colors.textMuted }}>
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>

          <Input
            label="Profesional"
            placeholder="Ej: Rojas"
            value={professionalQuery}
            onChangeText={setProfessionalQuery}
            autoCapitalize="none"
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: theme.spacing.md }}>
            <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, fontWeight: "800" }}>
              Resultados: {filtered.length}
            </Text>
            {filtered.length > 0 ? (
              <Pressable onPress={clearFilters}>
                <Text style={{ color: theme.colors.primaryDark, fontWeight: "900" }}>Limpiar filtros</Text>
              </Pressable>
            ) : null}
          </View>
        </Card>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Probá con otra especialidad o nombre de profesional."
          actionLabel="Ver todo"
          onActionPress={clearFilters}
          icon={<Sparkles size={34} color={theme.colors.primary} strokeWidth={2.2} />}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ gap: theme.spacing.md }}
          renderItem={({ item }) => <ProfessionalCard professional={item} whatsappUrl={whatsappFor(item)} />}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.md / 2 }} />}
        />
      )}
    </Screen>
  );
}

function ProfessionalCard({ professional, whatsappUrl }: { professional: Professional; whatsappUrl: string }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/detalle-profesional/${professional.id}`)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
        <ListItem
          title={professional.name}
          subtitle={professional.specialty}
          icon={<UserRound size={18} color={theme.colors.primary} strokeWidth={2.2} />}
          right={<ArrowRight size={18} color={theme.colors.textMuted} strokeWidth={2.2} />}
          style={{ backgroundColor: "transparent", borderWidth: 0, padding: 0, shadowOpacity: 0, elevation: 0 }}
        />

        {professional.modalidad ? (
          <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, fontWeight: "700" }}>
            Modalidad: {professional.modalidad}
          </Text>
        ) : null}

        {professional.observaciones ? (
          <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>{professional.observaciones}</Text>
        ) : null}

        <View style={{ flexDirection: "row", gap: theme.spacing.md, flexWrap: "wrap", marginTop: theme.spacing.sm }}>
          <View style={{ flex: 1, minWidth: 180 }}>
            <Button title="Solicitar turno" size="lg" variant="primary" onPress={() => openUrl(whatsappUrl)} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

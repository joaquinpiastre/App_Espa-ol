import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Search, ArrowRight, Phone, MessageCircle } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { SearchBar } from "../../../components/ui/SearchBar";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { prestadoresMock } from "../../../mock-data/prestadores";
import type { Prestador } from "../../../types/prestadores";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { InfoRow } from "../../../components/ui/InfoRow";
import { makeTelUrl, makeWhatsAppUrl, openUrl } from "../../../utils/links";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";

export function Prestadores() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return prestadoresMock;
    return prestadoresMock.filter((p) => {
      const hay = `${p.nombre} ${p.cobertura.join(" ")} ${p.detalle} ${p.contacto.email ?? ""} ${p.contacto.telefono ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search]);

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle title="Prestadores" subtitle="Coberturas y contacto (mock)." />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre o cobertura..."
          leftIcon={<Search size={18} color={theme.colors.primary} strokeWidth={2.2} />}
        />
        <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, fontWeight: "800" }}>
          Resultados: {filtered.length}
        </Text>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Probá con otro nombre o cobertura."
          actionLabel="Limpiar"
          onActionPress={() => setSearch("")}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ gap: theme.spacing.md }}
          renderItem={({ item }) => (
            <PrestadorCard prestador={item} onOpenDetail={() => router.push(`/detalle-prestador/${item.id}`)} />
          )}
        />
      )}
    </Screen>
  );
}

function PrestadorCard({
  prestador,
  onOpenDetail,
}: {
  prestador: Prestador;
  onOpenDetail: () => void;
}) {
  const { whatsappNumber, phoneForTel } = useHesmContacts();
  const telUrl = makeTelUrl(phoneForTel);

  const whatsappUrl = makeWhatsAppUrl(
    whatsappNumber,
    `Hola, necesito coordinar un turno. Cobertura: ${prestador.nombre}. ¿Podrían indicarme disponibilidad y requisitos?`
  );

  const coberturaChips = prestador.cobertura.slice(0, 4);

  return (
    <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
      <Pressable onPress={onOpenDetail}>
        <View style={{ gap: theme.spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.md }}>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: theme.radii.md,
                backgroundColor: theme.colors.primarySoft,
                borderWidth: 1,
                borderColor: theme.colors.primaryBorderMuted,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />
            </View>

            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>
                {prestador.nombre}
              </Text>

              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                Cobertura: {prestador.cobertura.join(" • ")}
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: theme.spacing.sm }}>
                {coberturaChips.map((c) => (
                  <View
                    key={c}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: theme.colors.surfaceMuted,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, fontWeight: "800" }}>
                      {c}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ paddingTop: 6 }}>
              <ArrowRight size={18} color={theme.colors.textMuted} strokeWidth={2.2} />
            </View>
          </View>

          <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }} numberOfLines={4}>
            {prestador.detalle}
          </Text>
        </View>
      </Pressable>

      {(prestador.contacto.telefono || prestador.contacto.email || prestador.contacto.observaciones) ? (
        <View style={{ gap: theme.spacing.sm }}>
          <InfoRow
            label="Teléfono"
            value={prestador.contacto.telefono}
            icon={<Phone size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />}
          />
          <InfoRow
            label="Email"
            value={prestador.contacto.email}
            icon={<MessageCircle size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />}
          />
          {prestador.contacto.observaciones ? (
            <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, lineHeight: 18 }}>
              {prestador.contacto.observaciones}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Button
            title="Llamar"
            variant="secondary"
            size="md"
            onPress={() => openUrl(telUrl)}
            iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="WhatsApp"
            variant="primary"
            size="md"
            onPress={() => openUrl(whatsappUrl)}
            iconLeft={<MessageCircle size={18} color="#fff" strokeWidth={2.2} />}
          />
        </View>
      </View>
    </Card>
  );
}


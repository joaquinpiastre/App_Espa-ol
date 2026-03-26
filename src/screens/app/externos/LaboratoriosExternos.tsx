import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Search, Phone, MapPin } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { SearchBar } from "../../../components/ui/SearchBar";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { laboratoriosExternosMock } from "../../../mock-data/laboratoriosExternos";
import { InfoRow } from "../../../components/ui/InfoRow";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { LaboratorioExterno } from "../../../types/externos";
import { makeMapsUrl, makeTelUrl, openUrl } from "../../../utils/links";

export function LaboratoriosExternos() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return laboratoriosExternosMock;
    return laboratoriosExternosMock.filter((l) => {
      const hay = `${l.nombre} ${l.direccion} ${l.telefono} ${l.horarios} ${l.observaciones ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search]);

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle title="Laboratorios externos" subtitle="Listado y contactos (mock)." />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre o dirección..."
          leftIcon={<Search size={18} color={theme.colors.primary} strokeWidth={2.2} />}
        />
        <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, fontWeight: "800" }}>
          Resultados: {filtered.length}
        </Text>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="Sin resultados" description="Probá con otro criterio." actionLabel="Ver todo" onActionPress={() => setSearch("")} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ gap: theme.spacing.md }}
          renderItem={({ item }) => <LaboratorioCard laboratorio={item} />}
        />
      )}
    </Screen>
  );
}

function LaboratorioCard({ laboratorio }: { laboratorio: LaboratorioExterno }) {
  const telUrl = makeTelUrl(laboratorio.telefono);
  const mapsUrl = makeMapsUrl(laboratorio.direccion);

  return (
    <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
      <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
        {laboratorio.nombre}
      </Text>
      <InfoRow label="Dirección" value={laboratorio.direccion} />
      <InfoRow label="Teléfono" value={laboratorio.telefono} icon={<Phone size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
      <InfoRow label="Horarios" value={laboratorio.horarios} />

      {laboratorio.observaciones ? (
        <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
          {laboratorio.observaciones}
        </Text>
      ) : null}

      <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Button
            title="Llamar"
            variant="secondary"
            size="lg"
            onPress={() => openUrl(telUrl)}
            iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Mapa"
            variant="secondary"
            size="lg"
            onPress={() => openUrl(mapsUrl)}
            iconLeft={<MapPin size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
          />
        </View>
      </View>
    </Card>
  );
}


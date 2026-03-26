import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Search, Phone, MapPin } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { SearchBar } from "../../../components/ui/SearchBar";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { consultoriosExternosMock } from "../../../mock-data/consultoriosExternos";
import { InfoRow } from "../../../components/ui/InfoRow";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { ConsultorioExterno } from "../../../types/externos";
import { makeMapsUrl, makeTelUrl, openUrl } from "../../../utils/links";

export function ConsultoriosExternos() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return consultoriosExternosMock;
    return consultoriosExternosMock.filter((c) => {
      const hay = `${c.nombre} ${c.especialidad} ${c.direccion} ${c.telefono} ${c.horarios} ${c.observaciones ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search]);

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle title="Consultorios externos" subtitle="Listado y contactos (mock)." />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre o especialidad..."
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
          renderItem={({ item }) => <ConsultorioCard consultorio={item} />}
        />
      )}
    </Screen>
  );
}

function ConsultorioCard({ consultorio }: { consultorio: ConsultorioExterno }) {
  const telUrl = makeTelUrl(consultorio.telefono);
  const mapsUrl = makeMapsUrl(consultorio.direccion);

  return (
    <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
      <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
        {consultorio.nombre}
      </Text>
      <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
        Especialidad: {consultorio.especialidad}
      </Text>

      <InfoRow label="Dirección" value={consultorio.direccion} />
      <InfoRow label="Teléfono" value={consultorio.telefono} icon={<Phone size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
      <InfoRow label="Horarios" value={consultorio.horarios} />

      {consultorio.observaciones ? (
        <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
          {consultorio.observaciones}
        </Text>
      ) : null}

      <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Button title="Llamar" variant="secondary" size="lg" onPress={() => openUrl(telUrl)} iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Mapa" variant="secondary" size="lg" onPress={() => openUrl(mapsUrl)} iconLeft={<MapPin size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
        </View>
      </View>
    </Card>
  );
}


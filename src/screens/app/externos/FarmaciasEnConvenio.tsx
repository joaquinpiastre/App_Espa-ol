import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { ExternalLink, Search } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { SearchBar } from "../../../components/ui/SearchBar";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { farmaciasConvenioMock } from "../../../mock-data/farmaciasConvenio";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { FarmaciaConvenio } from "../../../types/externos";
import { openUrl } from "../../../utils/links";
import { HESM_CONFIG } from "../../../constants/appConfig";

const VERIFICACION_SOCIOS_URL = "https://www.hesm.org/convenios/";

export function FarmaciasEnConvenio() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return farmaciasConvenioMock;
    return farmaciasConvenioMock.filter((f) => {
      const hay = `${f.nombre} ${f.descripcion}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search]);

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle
        title="Farmacias en convenio"
        subtitle="Beneficios en medicamentos para socios con credencial o número de socio."
      />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
        <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
          Las farmacias adheridas mantienen convenio con el Hospital Español del Sur Mendocino. Para consultas sobre el
          convenio o verificación de socios podés comunicarte al hospital.
        </Text>
        <Button
          title="Verificación de socios (web)"
          variant="secondary"
          size="lg"
          onPress={() => openUrl(VERIFICACION_SOCIOS_URL)}
          iconLeft={<ExternalLink size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
        />
      </Card>

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre..."
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
          renderItem={({ item }) => <FarmaciaCard farmacia={item} />}
        />
      )}
    </Screen>
  );
}

function FarmaciaCard({ farmacia }: { farmacia: FarmaciaConvenio }) {
  return (
    <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
      <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>{farmacia.nombre}</Text>
      <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>{farmacia.descripcion}</Text>
      <Button
        title="Visitar sitio web"
        variant="primary"
        size="lg"
        onPress={() => openUrl(farmacia.urlWeb)}
        iconLeft={<ExternalLink size={18} color="#fff" strokeWidth={2.2} />}
      />
    </Card>
  );
}

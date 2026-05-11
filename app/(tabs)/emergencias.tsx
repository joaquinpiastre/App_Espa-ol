import React from "react";
import { RequireSocio } from "../../src/components/auth/RequireSocio";
import { Emergencias } from "../../src/screens/app/emergencias/Emergencias";

export default function EmergenciasRoute() {
  return (
    <RequireSocio>
      <Emergencias />
    </RequireSocio>
  );
}


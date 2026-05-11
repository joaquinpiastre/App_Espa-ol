import React from "react";
import { RequireSocio } from "../src/components/auth/RequireSocio";
import { Turnos } from "../src/screens/app/turnos/Turnos";

export default function TurnosRoute() {
  return (
    <RequireSocio>
      <Turnos />
    </RequireSocio>
  );
}


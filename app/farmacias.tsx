import React from "react";
import { RequireSocio } from "../src/components/auth/RequireSocio";
import { FarmaciasEnConvenio } from "../src/screens/app/externos/FarmaciasEnConvenio";

export default function FarmaciasRoute() {
  return (
    <RequireSocio>
      <FarmaciasEnConvenio />
    </RequireSocio>
  );
}

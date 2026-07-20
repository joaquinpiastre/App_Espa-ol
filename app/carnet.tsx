import React from "react";
import { RequireSocio } from "../src/components/auth/RequireSocio";
import { CarnetDigital } from "../src/screens/app/carnet/CarnetDigital";

export default function CarnetRoute() {
  return (
    <RequireSocio>
      <CarnetDigital />
    </RequireSocio>
  );
}

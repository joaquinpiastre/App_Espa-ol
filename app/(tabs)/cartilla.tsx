import React from "react";
import { RequireSocio } from "../../src/components/auth/RequireSocio";
import { CartillaMedica } from "../../src/screens/app/cartilla/CartillaMedica";

export default function CartillaRoute() {
  return (
    <RequireSocio>
      <CartillaMedica />
    </RequireSocio>
  );
}


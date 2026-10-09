"use client";

import { useEffect } from "react";
import PantallaError from "@/components/PantallaError";

// Next usa este archivo cuando algo falla al pintar una pantalla.
// `reset` vuelve a intentar pintar la pantalla sin recargar toda la app.
export default function Error({ error, reset }) {
  useEffect(() => {
    // El detalle técnico va solo a la consola; la persona ve el texto amable.
    console.error(error);
  }, [error]);

  return <PantallaError error={error} referencia={error?.digest} onReintentar={reset} />;
}
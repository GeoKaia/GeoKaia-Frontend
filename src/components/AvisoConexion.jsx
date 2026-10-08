"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

// Franja fija arriba mientras el dispositivo no tiene internet. Así, cuando algo falla por la conexión
// (algo frecuente con redes inestables), la causa ya está a la vista antes de que aparezca un error.

function suscribir(avisar) {
  window.addEventListener("online", avisar);
  window.addEventListener("offline", avisar);
  return () => {
    window.removeEventListener("online", avisar);
    window.removeEventListener("offline", avisar);
  };
}

export default function AvisoConexion() {
  const enLinea = useSyncExternalStore(
    suscribir,
    () => navigator.onLine,
    () => true
  );

  if (enLinea) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[2500] flex items-center justify-center gap-2 bg-accent-dark px-4 py-2 text-center text-sm font-medium text-white shadow"
    >
      <WifiOff size={16} aria-hidden="true" />
      Sin conexión a internet. Lo que intentes guardar no se va a enviar hasta que vuelva.
    </div>
  );
}

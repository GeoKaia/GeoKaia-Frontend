"use client";

import { useSyncExternalStore } from "react";
import { leerLoader, suscribirLoader, LOADER_SERVIDOR } from "../../lib/loaderStore";
import VolcanLoader from "./VolcanLoader";
import LagoLoader from "./LagoLoader";

/**
 * Capa que cubre toda la pantalla mientras haya cargas activas.
 * Se monta una sola vez en app/layout.js. Muestra el volcán cuando alguna carga
 * lo pidió (arranque del servidor) y el lago en el resto de los casos.
 */
export default function GlobalLoader() {
  const { visible, variante } = useSyncExternalStore(
    suscribirLoader,
    leerLoader,
    () => LOADER_SERVIDOR
  );

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[3000] overflow-y-auto">
      {variante === "volcan" ? <VolcanLoader /> : <LagoLoader />}
    </div>
  );
}
"use client";

import { useSyncExternalStore } from "react";
import { CLAVE_TEMA, CLAVE_TAMANO } from "./preferencias";

// Las preferencias viven en atributos de <html> (clase `dark` y data-font-scale); el script de
// preferencias.js los pone antes de pintar. Estos hooks leen esos atributos y se enteran de los
// cambios con un MutationObserver, así que cualquier componente queda sincronizado sin estado propio.

function suscribir(avisar) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-font-scale"] });
  return () => observador.disconnect();
}

function guardar(clave, valor) {
  try {
    window.localStorage.setItem(clave, valor);
  } catch {
    // sin almacenamiento: el cambio vale para esta visita y no se recuerda
  }
}

export function useModoOscuro() {
  const oscuro = useSyncExternalStore(
    suscribir,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
  function cambiar(activar) {
    document.documentElement.classList.toggle("dark", activar);
    guardar(CLAVE_TEMA, activar ? "dark" : "light");
  }
  return [oscuro, cambiar];
}

export function useTamanoLetra() {
  const tamano = useSyncExternalStore(
    suscribir,
    () => document.documentElement.dataset.fontScale || "normal",
    () => "normal"
  );
  function cambiar(nuevo) {
    if (nuevo === "normal") delete document.documentElement.dataset.fontScale;
    else document.documentElement.dataset.fontScale = nuevo;
    guardar(CLAVE_TAMANO, nuevo);
  }
  return [tamano, cambiar];
}

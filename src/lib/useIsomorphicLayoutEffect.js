import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect corre antes del primer paint (evita el flash de contenido sin
// animar), pero React tira un warning si se usa tal cual en el render de servidor.
// Este hook cae a useEffect en el server (donde de cualquier forma no hace nada)
// y usa useLayoutEffect real una vez en el navegador.
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

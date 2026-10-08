"use client";

import { useEffect, useRef } from "react";
import DatoNicaragua from "./DatoNicaragua";

/**
 * Pantalla de carga general: un círculo (lago) que se llena con olas y, debajo,
 * un dato curioso de Nicaragua elegido al azar.
 * Usa los tokens de color de la app, así que se adapta solo al modo oscuro.
 */
export default function LagoLoader() {
  const svgRef = useRef(null);

  useEffect(() => {
    // Las animaciones SMIL del SVG no respetan prefers-reduced-motion por sí solas:
    // si la persona pidió menos movimiento, dejamos el lago quieto, a medio llenar.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svgRef.current?.setCurrentTime?.(3);
      svgRef.current?.pauseAnimations?.();
    }
  }, []);

  return (
    <div
      role="status"
      aria-label="Cargando"
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-brand-bg px-6 py-10 text-center"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="h-auto w-[min(60vw,14rem)]"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="gk-lago-clip">
            <circle cx="100" cy="100" r="88" />
          </clipPath>
        </defs>

        <g clipPath="url(#gk-lago-clip)">
          <rect x="0" y="0" width="200" height="200" className="fill-surface" />
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 100;0 -60;0 -60"
              keyTimes="0;0.85;1"
              dur="6s"
              repeatCount="indefinite"
            />
            <path
              d="M-100 110 q 25 -14 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V 400 H -100 Z"
              className="fill-accent-dark"
              opacity="0.85"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;100 0"
                dur="2.6s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M-100 118 q 25 -12 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V 400 H -100 Z"
              className="fill-accent"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="100 0;0 0"
                dur="3.4s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>

        <circle cx="100" cy="100" r="88" fill="none" strokeWidth="5" className="stroke-accent-fg" />
      </svg>

      <DatoNicaragua
        className="mt-9 min-h-[9.5rem]"
        claseTitulo="font-serif text-[clamp(1.25rem,5vw,1.5rem)] font-bold text-accent-fg"
        claseTexto="mt-3 text-[clamp(1rem,4.2vw,1.125rem)] leading-relaxed text-brand-text"
      />
    </div>
  );
}
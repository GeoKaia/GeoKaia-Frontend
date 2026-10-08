"use client";

import { useEffect, useRef } from "react";
import DatoNicaragua from "./DatoNicaragua";

const LAVA = "#e0944a";
const ARENA = "#e8c9a0";
const MONTANA = "#0b3a4e";
const OLA_FONDO = "#1c6b88";

const BRASAS = [
  { cx: 112, r: 2.5, hasta: 8, inicio: "0s" },
  { cx: 128, r: 2, hasta: 14, inicio: "0.8s" },
  { cx: 120, r: 3, hasta: 2, inicio: "1.6s" },
];

/**
 * Pantalla de carga con el volcán de la marca. Pensada para el arranque en frío
 * del servidor (Render tarda ~30 s en despertar en el plan gratuito), por eso
 * muestra datos curiosos que van cambiando mientras la persona espera.
 * Ocupa todo el alto disponible y se adapta al ancho del dispositivo.
 */
export default function VolcanLoader({ mensaje = "Despertando el servidor" }) {
  const svgRef = useRef(null);

  useEffect(() => {
    // Las animaciones SMIL del SVG no respetan prefers-reduced-motion por sí solas:
    // si la persona pidió menos movimiento, dejamos el dibujo quieto en un fotograma.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svgRef.current?.setCurrentTime?.(1);
      svgRef.current?.pauseAnimations?.();
    }
  }, []);

  return (
    <div
      role="status"
      aria-label={mensaje}
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-3 bg-accent-dark px-6 py-10 text-center"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 240 200"
        className="h-auto w-[min(72vw,17rem)]"
        aria-hidden="true"
      >
        <ellipse cx="120" cy="62" rx="34" ry="9" fill={LAVA} opacity="0.35">
          <animate attributeName="rx" values="30;44;30" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </ellipse>

        {BRASAS.map((b) => (
          <circle key={b.cx} cx={b.cx} cy="58" r={b.r} fill={ARENA}>
            <animate
              attributeName="cy"
              values={`58;${b.hasta}`}
              dur="2.4s"
              begin={b.inicio}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2.4s"
              begin={b.inicio}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        <path d="M20 170 L92 64 Q120 56 148 64 L220 170 Z" fill={MONTANA} />

        <path
          d="M96 66 Q120 74 144 66"
          fill="none"
          stroke={LAVA}
          strokeWidth="5"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke"
            values={`${LAVA};#f2b36a;${LAVA}`}
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M112 72 Q108 100 116 120 Q122 140 112 168"
          fill="none"
          stroke={LAVA}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="6 8"
        >
          <animate attributeName="stroke-dashoffset" values="28;0" dur="1.2s" repeatCount="indefinite" />
        </path>

        <path
          d="M-100 176 q 25 -10 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V 200 H -100 Z"
          fill={OLA_FONDO}
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="100 0;0 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M-100 184 q 25 -10 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V 200 H -100 Z"
          className="fill-accent"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;100 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <p className="font-serif text-[clamp(1.9rem,8vw,2.5rem)] font-bold leading-tight">
        <span className="text-white">Geo</span>
        <span className="text-[#e8c9a0]">Kaia</span>
      </p>

      <p className="mt-3 text-[clamp(1rem,4.2vw,1.125rem)] font-semibold text-[#efe8da]">
        {mensaje}
        <span className="loader-dot" aria-hidden="true">.</span>
        <span className="loader-dot" aria-hidden="true" style={{ animationDelay: "0.2s" }}>.</span>
        <span className="loader-dot" aria-hidden="true" style={{ animationDelay: "0.4s" }}>.</span>
      </p>

      <DatoNicaragua
        className="mt-2 min-h-[8.5rem]"
        claseTitulo="text-sm font-semibold uppercase tracking-wide text-[#e8c9a0]"
        claseTexto="mt-2 text-base leading-relaxed text-[#efe8da]"
      />

      <div
        className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-[#1c6b88]"
        aria-hidden="true"
      >
        <div className="loader-thumb h-1 w-2/5 rounded-full bg-[#e8c9a0]" />
      </div>
    </div>
  );
}
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

// Franja al principio de la home, antes del chat de Kaia. Tres tramos, de arriba a
// abajo: (1) banda sólida de accent con una ola SVG animada en su borde inferior,
// (2) un tramo corto de degradé del mismo accent al blanco (fusiona la banda sólida
// con el fondo sin cortar en seco), (3) el isologo a color con transparencia real,
// ya sobre fondo prácticamente blanco para que tenga contraste real — next/image lo
// sirve optimizado/redimensionado (el archivo original pesa ~600KB a 2000x1414).
// drop-shadow (no box-shadow) porque sigue el alfa real, no un rectángulo.
export default function HeroLogo() {
  const logoRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!logoRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(logoRef.current, { opacity: 1, scale: 1 });
      return;
    }

    const tween = gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }
    );
    return () => tween.kill();
  }, []);

  return (
    <section className="w-full flex flex-col items-center">
      {/* Banda sólida + ola. El degradé de abajo arranca en el mismo "accent" de esta
          banda (no en accent-dark) para que no haya ningún salto de color en el borde
          — la ola es una sombra translúcida (no un segundo color plano) apoyada sobre
          ese mismo fondo, así se ve como una ondulación de agua y no como un bloque. */}
      <div className="relative w-full h-16 sm:h-20 bg-accent">
        <div className="absolute inset-x-0 -bottom-px h-6 sm:h-8 overflow-hidden leading-none">
          <div className="flex w-[200%] animate-wave">
            {[0, 1].map((copia) => (
              <svg
                key={copia}
                className="w-1/2 h-6 sm:h-8 shrink-0"
                viewBox="0 0 1440 60"
                preserveAspectRatio="none"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
                  fill="rgba(0,0,0,0.12)"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Tramo de fusión: arranca en el mismo accent de la banda de arriba (sin salto)
          y recién ahí se difumina a blanco. */}
      <div className="w-full h-10 sm:h-14 bg-gradient-to-b from-accent to-brand-bg" />

      {/* Logo, ya sobre fondo casi blanco. Poco padding arriba: pegado a la fusión,
          no queremos un vacío blanco entre el degradé y el logo. */}
      <div className="w-full pt-2 pb-6 sm:pt-3 sm:pb-8 flex items-center justify-center">
        <Image
          ref={logoRef}
          src="/icons/kaia-emblema.png"
          alt="GeoKaia"
          width={226}
          height={160}
          priority
          className="w-64 sm:w-80 h-auto drop-shadow-lg"
        />
      </div>
    </section>
  );
}

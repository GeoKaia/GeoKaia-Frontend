"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

// Franja al principio de la home, antes del chat de Kaia, con un degradé del accent
// claro (celeste/turquesa) que se funde al blanco de fondo del resto de la app. El
// emblema es el isologo a color con transparencia real — next/image lo sirve
// optimizado/redimensionado (el archivo original pesa ~600KB a 2000x1414).
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
    <section className="w-full bg-gradient-to-b from-accent to-brand-bg py-12 flex items-center justify-center">
      <Image
        ref={logoRef}
        src="/icons/kaia-emblema.png"
        alt="GeoKaia"
        width={226}
        height={160}
        priority
        className="w-64 sm:w-80 h-auto drop-shadow-lg"
      />
    </section>
  );
}

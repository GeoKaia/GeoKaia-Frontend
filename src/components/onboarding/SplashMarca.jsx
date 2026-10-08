"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import PatronMarca from "./PatronMarca";

const DURACION_AUTO_MS = 3400;
const DURACION_AUTO_REDUCIDA_MS = 1200;

// Splash de marca: anillos de agua que se expanden -> el emblema aparece con un pop -> se
// cambia por el logo largo con un barrido de izquierda a derecha -> aparece el hint.
// Después de ~3,4 s avanza solo; tocar la pantalla lo salta.
// El logo es un PNG (no hay vector), así que todo se anima con transformaciones/máscaras.
export default function SplashMarca({ onContinuar }) {
  const raizRef = useRef(null);
  const patronRef = useRef(null);
  const emblemaRef = useRef(null);
  const logoRef = useRef(null);
  const hintRef = useRef(null);
  const yaContinuo = useRef(false);

  function continuar() {
    if (yaContinuo.current) return;
    yaContinuo.current = true;
    onContinuar();
  }

  useIsomorphicLayoutEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    const anillos = raiz.querySelectorAll(".ob-ripple");
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Los elementos arrancan ocultos por CSS (.ob-s-*), así no se ve un "flash" del estado final
    // antes de que corra la animación.
    if (reducido) {
      gsap.set([patronRef.current, logoRef.current, hintRef.current], { opacity: 1 });
      gsap.set(logoRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      const t = gsap.delayedCall(DURACION_AUTO_REDUCIDA_MS / 1000, continuar);
      return () => t.kill();
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(patronRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0)
      .fromTo(
        anillos,
        { scale: 0.25, opacity: 0.55 },
        { scale: 3.4, opacity: 0, duration: 2.2, stagger: 0.38, ease: "sine.out" },
        0.1
      )
      .fromTo(
        emblemaRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.85, ease: "elastic.out(1, 0.6)" },
        0.2
      )
      // Cambio emblema -> logo largo. clip-path con el MISMO formato en inicio y fin
      // (inset de 4 valores) para que GSAP pueda interpolar.
      .to(emblemaRef.current, { opacity: 0, scale: 0.85, duration: 0.35, ease: "power1.in" }, 1.4)
      .fromTo(
        logoRef.current,
        { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
        { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "power2.inOut" },
        1.3
      )
      .fromTo(hintRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 2.3);

    const auto = gsap.delayedCall(DURACION_AUTO_MS / 1000, continuar);
    return () => {
      tl.kill();
      auto.kill();
    };
  }, []);

  return (
    <section ref={raizRef} className="ob-splash" aria-label="Pantalla de inicio de GeoKaia">
      <div ref={patronRef} className="ob-s-patron">
        <PatronMarca />
      </div>

      <div className="ob-s-centro">
        <span className="ob-ripple" aria-hidden="true" />
        <span className="ob-ripple" aria-hidden="true" />
        <span className="ob-ripple" aria-hidden="true" />

        <Image
          ref={emblemaRef}
          className="ob-s-emblema"
          src="/icons/kaia-emblema.png"
          alt=""
          width={400}
          height={283}
          priority
        />

        <div ref={logoRef} className="ob-s-logo">
          <Image
            src="/icons/geokaia-logo-largo.png"
            alt="GeoKaia — Turismo digital de Nicaragua"
            width={1848}
            height={701}
            priority
            sizes="(max-width: 860px) 80vw, 320px"
          />
        </div>
      </div>

      <span ref={hintRef} className="ob-s-hint">
        Tocá para continuar
      </span>

      <button type="button" className="ob-splash-tap" aria-label="Saltar la animación y continuar" onClick={continuar} />
    </section>
  );
}

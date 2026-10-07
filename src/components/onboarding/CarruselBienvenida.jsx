"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ArteMapa, ArteRutas, ArteKaia, ArteNegocio } from "./ArtesSlides";
import PatronMarca from "./PatronMarca";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const SLIDES = [
  {
    id: "mapa",
    titulo: "Todo Nicaragua, en un mapa.",
    texto: "Volcanes, lagunas, iglesias coloniales y mercados con su pin. Tocá uno y mirá fotos, horarios y cómo llegar.",
    Arte: ArteMapa,
  },
  {
    id: "rutas",
    titulo: "Rutas listas para recorrer.",
    texto: "Recorridos curados por el equipo, con paradas, tiempos y distancias entre cada lugar.",
    Arte: ArteRutas,
  },
  {
    id: "kaia",
    titulo: "Kaia, tu guía con IA.",
    texto: "Contale qué te gusta y te recomienda rutas con lugares reales de GeoKaia.",
    Arte: ArteKaia,
  },
  {
    id: "negocios",
    titulo: "¿Tenés un negocio turístico?",
    texto: "Sumá tu lugar al mapa, gratis o Premium con foto 360°, video y más, y que te encuentren.",
    Arte: ArteNegocio,
  },
];

export default function CarruselBienvenida({ slideInicial = 0, onEmpezar, onSaltar, onNegocio }) {
  const pistaRef = useRef(null);
  const [idx, setIdx] = useState(() => Math.min(Math.max(slideInicial, 0), SLIDES.length - 1));
  const ultimo = SLIDES.length - 1;

  const irA = useCallback((i, suave = true) => {
    const pista = pistaRef.current;
    if (!pista) return;
    const destino = Math.min(Math.max(i, 0), ultimo);
    pista.scrollTo({ left: destino * pista.clientWidth, behavior: suave ? "smooth" : "auto" });
  }, [ultimo]);

  // Si arrancamos en un slide distinto del primero (?slide=N), posicionarse antes del primer paint.
  useIsomorphicLayoutEffect(() => {
    if (idx > 0) irA(idx, false);
    // solo al montar
  }, []);

  // Mantener el slide actual alineado si cambia el ancho (por ejemplo al pasar de marco a pantalla completa).
  useEffect(() => {
    const alRedimensionar = () => irA(idx, false);
    window.addEventListener("resize", alRedimensionar);
    return () => window.removeEventListener("resize", alRedimensionar);
  }, [idx, irA]);

  // Flechas del teclado (útil en web).
  useEffect(() => {
    function alTeclear(e) {
      if (e.key === "ArrowRight") irA(idx + 1);
      if (e.key === "ArrowLeft") irA(idx - 1);
    }
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [idx, irA]);

  function alDeslizar() {
    const pista = pistaRef.current;
    if (!pista || !pista.clientWidth) return;
    const i = Math.round(pista.scrollLeft / pista.clientWidth);
    if (i !== idx) setIdx(Math.min(Math.max(i, 0), ultimo));
  }

  function siguiente() {
    if (idx < ultimo) irA(idx + 1);
    else onEmpezar();
  }

  const esUltimo = idx === ultimo;

  return (
    <section className="ob-carrusel" aria-roledescription="carrusel" aria-label="Presentación de GeoKaia">
      <div className="ob-c-patron">
        <PatronMarca />
      </div>

      <div className="ob-c-top">
        <Image
          className="ob-c-logo"
          src="/icons/geokaia-logo-largo.png"
          alt="GeoKaia"
          width={1848}
          height={701}
          sizes="120px"
        />
        <button type="button" className="ob-saltar" onClick={onSaltar}>
          Saltar
        </button>
      </div>

      <div ref={pistaRef} className="ob-pista" onScroll={alDeslizar}>
        {SLIDES.map(({ id, titulo, texto, Arte }, i) => (
          <article
            key={id}
            className="ob-slide"
            data-activa={i === idx}
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${SLIDES.length}`}
            aria-hidden={i !== idx}
            inert={i !== idx}
          >
            <Arte />
            <h2 className="ob-titulo">{titulo}</h2>
            <p className="ob-texto">{texto}</p>
            {id === "negocios" && (
              <button type="button" className="ob-enlace" onClick={onNegocio}>
                Soy un negocio
                <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
              </button>
            )}
          </article>
        ))}
      </div>

      <p className="ob-sr" aria-live="polite">
        {`Diapositiva ${idx + 1} de ${SLIDES.length}: ${SLIDES[idx].titulo}`}
      </p>

      <div className="ob-pie">
        <div className="ob-puntos" role="group" aria-label="Ir a una diapositiva">
          {SLIDES.map(({ id, titulo }, i) => (
            <button
              key={id}
              type="button"
              className="ob-punto-nav"
              data-activo={i === idx}
              aria-label={`Ir a: ${titulo}`}
              aria-current={i === idx ? "true" : undefined}
              onClick={() => irA(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="ob-btn"
          onClick={siguiente}
          aria-label={esUltimo ? "Empezar a explorar GeoKaia" : undefined}
        >
          {esUltimo ? "Empezar" : "Siguiente"}
          {esUltimo && <ArrowRight size={18} strokeWidth={2.6} aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}

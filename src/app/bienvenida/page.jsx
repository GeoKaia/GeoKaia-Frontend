"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Nunito } from "next/font/google";
import { Map, Route, Sparkles, Store, RotateCcw, ArrowRight } from "lucide-react";
import SplashMarca from "@/components/onboarding/SplashMarca";
import CarruselBienvenida from "@/components/onboarding/CarruselBienvenida";
import { marcarOnboardingVisto } from "@/lib/onboarding";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import "./bienvenida.css";

// Nunito es la tipografía del mockup de Figma. Se carga solo para esta página.
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });

const PUNTOS_PANEL = [
  { Icono: Map, texto: "Un mapa interactivo con los lugares más lindos de Nicaragua." },
  { Icono: Route, texto: "Rutas curadas, con paradas, tiempos y distancias." },
  { Icono: Sparkles, texto: "Kaia, una guía con IA que te recomienda recorridos." },
  { Icono: Store, texto: "Un espacio para que los negocios turísticos se sumen." },
];

function Bienvenida() {
  const router = useRouter();
  const params = useSearchParams();
  // ?splash=0 salta el splash y ?slide=N (1-4) abre directo ese slide: sirven para demos y capturas.
  const saltarSplash = params.get("splash") === "0" || params.has("slide");
  const slideInicial = Math.max(0, (parseInt(params.get("slide") || "1", 10) || 1) - 1);

  const [paso, setPaso] = useState(saltarSplash ? "carrusel" : "splash");
  const [vuelta, setVuelta] = useState(0); // al reiniciar la demo se remonta todo

  // En escritorio el celular mide 390x844 y se escala (zoom) para entrar en la altura de la ventana.
  // En móvil (<= 860px) el CSS lo deja a pantalla completa y el zoom se ignora.
  const celularRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    function ajustarEscala() {
      const celular = celularRef.current;
      if (!celular) return;
      const escala = Math.min(1, Math.max(0.45, (window.innerHeight - 48) / 844));
      celular.style.zoom = String(escala);
    }
    ajustarEscala();
    window.addEventListener("resize", ajustarEscala);
    return () => window.removeEventListener("resize", ajustarEscala);
  }, []);

  // Mientras el onboarding está abierto, la página de atrás (home) no debe poder scrollear.
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  function terminar(destino = "/") {
    marcarOnboardingVisto();
    router.replace(destino);
  }

  function reiniciar() {
    setPaso("splash");
    setVuelta((v) => v + 1);
  }

  return (
    <div className={`ob-raiz ${nunito.className}`}>
      <span className="ob-circulo ob-circulo-a" aria-hidden="true" />
      <span className="ob-circulo ob-circulo-b" aria-hidden="true" />

      <div className="ob-escenario">
        <div ref={celularRef} className="ob-celular">
          <div className="ob-pantalla">
            <span className="ob-isla" aria-hidden="true" />
            <div className="ob-estado" aria-hidden="true">
              <span>9:41</span>
              <span className="ob-estado-iconos" />
            </div>

            {paso === "splash" ? (
              <SplashMarca key={vuelta} onContinuar={() => setPaso("carrusel")} />
            ) : (
              <CarruselBienvenida
                key={vuelta}
                slideInicial={slideInicial}
                onEmpezar={() => terminar("/")}
                onSaltar={() => terminar("/")}
                onNegocio={() => terminar("/negocios")}
              />
            )}
          </div>
        </div>

        <aside className="ob-panel">
          <Image
            className="ob-panel-logo"
            src="/icons/geokaia-logo-largo.png"
            alt="GeoKaia — Turismo digital de Nicaragua"
            width={1848}
            height={701}
            sizes="260px"
          />
          <h1 className="ob-panel-titulo">Turismo creativo y cultural de Nicaragua</h1>
          <p className="ob-panel-texto">
            GeoKaia junta en una sola app los lugares, las rutas y una guía con IA para descubrir el país, y le da a los
            negocios locales un lugar en el mapa.
          </p>
          <ul className="ob-panel-lista">
            {PUNTOS_PANEL.map(({ Icono, texto }) => (
              <li key={texto}>
                <span>
                  <Icono size={18} strokeWidth={2.2} aria-hidden="true" />
                </span>
                {texto}
              </li>
            ))}
          </ul>
          <div className="ob-panel-acciones">
            <button type="button" className="ob-panel-btn ob-panel-btn-principal" onClick={() => terminar("/")}>
              Ir a la app
              <ArrowRight size={16} strokeWidth={2.6} aria-hidden="true" />
            </button>
            <button type="button" className="ob-panel-btn" onClick={reiniciar}>
              <RotateCcw size={16} strokeWidth={2.4} aria-hidden="true" />
              Reiniciar demo
            </button>
          </div>
          <p className="ob-panel-credito">Techyardigans · Hackathon Nicaragua 2026</p>
        </aside>
      </div>
    </div>
  );
}

// useSearchParams necesita un límite de Suspense para poder prerenderizar la página.
export default function BienvenidaPage() {
  return (
    <Suspense fallback={null}>
      <Bienvenida />
    </Suspense>
  );
}

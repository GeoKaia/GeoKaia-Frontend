"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Route, Star, BookOpen, Store } from "lucide-react";
import Footer from "@/components/Footer";
import ChatKaia from "@/components/ChatKaia";
import { onboardingVisto } from "@/lib/onboarding";

// Importación dinámica apagando el SSR para evitar el error 'window is undefined' de Leaflet
const MapaBase = dynamic(() => import("@/components/MapaBase"), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-center text-brand-text/70 animate-pulse">
      Cargando mapa interactivo...
    </p>
  ),
});

// La marca del onboarding vive en localStorage y no cambia mientras la home está abierta:
// no hace falta suscribirse a nada.
const sinSuscripcion = () => () => {};

function BotonNav({ href, color, textColor = "#ffffff", Icono, children }) {
  return (
    <Link
      href={href}
      className="flex-1 min-w-[10rem] flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
      style={{ backgroundColor: color, color: textColor }}
    >
      <Icono size={18} />
      {children}
    </Link>
  );
}

export default function Home() {
  const router = useRouter();

  // Primera visita: mandar al onboarding (/bienvenida). En el servidor y durante la hidratación
  // el snapshot es `false`, así que no se pinta la home hasta saber si hay que redirigir
  // (sin flash de la home antes del redirect).
  const visto = useSyncExternalStore(sinSuscripcion, onboardingVisto, () => false);

  // Se relee la marca directamente (no se usa `visto`): en el primer commit tras hidratar `visto` todavía
  // vale el snapshot del servidor (false) y mandaría al onboarding incluso a quien ya lo vio.
  useEffect(() => {
    if (!onboardingVisto()) router.replace("/bienvenida");
  }, [router]);

  if (!visto) return <div className="min-h-dvh bg-brand-bg" aria-hidden="true" />;

  return (
    <div className="flex min-h-dvh flex-col bg-brand-bg">

      <main
        id="contenido"
        className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center gap-6 py-6 split:grid split:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] split:grid-rows-[auto_auto_auto_1fr] split:items-start split:gap-x-8 split:gap-y-5 split:px-6"
      >
        <ChatKaia />

        <div className="w-full max-w-2xl flex gap-3 px-4 split:px-0 flex-wrap">
          <BotonNav href="/rutas" color="var(--color-primary)" Icono={Route}>
            Lista de recorridos
          </BotonNav>
          <BotonNav href="/destacados" color="var(--color-accent-dark)" Icono={Star}>
            Lugares Destacados
          </BotonNav>
        </div>

        <section className="w-full max-w-4xl px-4 split:max-w-none split:px-0 split:col-start-2 split:row-start-1 split:row-span-4 split:sticky split:top-4">
          <h2 className="text-center text-sm font-semibold text-brand-text/70 mb-2">
            Explorá Nicaragua — Mapa de lugares
          </h2>
          <div className="bg-surface p-2 rounded-xl shadow-md border border-secondary/30">
            <MapaBase altura="h-[65dvh] min-h-[300px] max-h-[640px] split:h-[calc(100dvh-9rem)] split:max-h-none corto:h-[calc(100dvh-5.5rem)] corto:min-h-[240px]" />
          </div>
        </section>

        <div className="w-full max-w-2xl flex gap-3 px-4 split:px-0 flex-wrap">
          <BotonNav href="/sobre" color="var(--color-secondary)" textColor="var(--color-brand-text)" Icono={BookOpen}>
            Sobre GeoKaia
          </BotonNav>
          <BotonNav href="/negocios" color="var(--color-accent)" Icono={Store}>
            Para Negocios
          </BotonNav>
        </div>
      </main>

      <Footer />
    </div>
  );
}

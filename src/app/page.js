"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Route, Star, BookOpen, Store } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatKaia from "@/components/ChatKaia";

// Importación dinámica apagando el SSR para evitar el error 'window is undefined' de Leaflet
const MapaBase = dynamic(() => import("@/components/MapaBase"), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-center text-brand-text/60 animate-pulse">
      Cargando mapa interactivo...
    </p>
  ),
});

function BotonNav({ href, color, textColor = "#ffffff", Icono, children }) {
  return (
    <Link
      href={href}
      className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
      style={{ backgroundColor: color, color: textColor }}
    >
      <Icono size={18} />
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center gap-6 py-6">
        <ChatKaia />

        <div className="w-full max-w-2xl flex gap-3 px-4">
          <BotonNav href="/rutas" color="var(--color-primary)" Icono={Route}>
            Lista de recorridos
          </BotonNav>
          <BotonNav href="/destacados" color="var(--color-accent-dark)" Icono={Star}>
            Lugares Destacados
          </BotonNav>
        </div>

        <section className="w-full max-w-4xl px-4">
          <h2 className="text-center text-sm font-semibold text-brand-text/70 mb-2">
            Explorá Nicaragua — Mapa de lugares
          </h2>
          <div className="bg-white p-2 rounded-xl shadow-md border border-secondary/30">
            <MapaBase />
          </div>
        </section>

        <div className="w-full max-w-2xl flex gap-3 px-4">
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

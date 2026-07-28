"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { obtenerLugares } from "@/lib/api";

export default function DestacadosPage() {
  const [lugares, setLugares] = useState(null); // null = cargando
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerLugares()
      .then((data) => setLugares(data.filter((l) => l.tier === "PREMIUM")))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-4xl">
          <span className="text-3xl">⭐</span>
          <h1 className="text-xl font-bold text-brand-text mb-1">Lugares Destacados</h1>
          <p className="text-sm text-brand-text/60 mb-6">
            Los negocios premium de GeoKaia — con galería, video y visor 360°.
          </p>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {lugares === null && !error && (
            <p className="text-brand-text/60 animate-pulse">Cargando destacados...</p>
          )}

          {lugares?.length === 0 && (
            <p className="text-brand-text/60">
              Todavía no hay negocios premium — ¡pronto vas a encontrar los mejores acá!
            </p>
          )}

          {lugares && lugares.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lugares.map((lugar) => (
                <div key={lugar.id} className="bg-white border border-secondary/40 rounded-xl p-3 shadow-sm">
                  <PlaceCard lugar={lugar} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

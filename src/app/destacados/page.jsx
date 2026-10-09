"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
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
    <div className="flex min-h-dvh flex-col bg-brand-bg">

      <main id="contenido" className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-7xl">
          <Star size={32} className="text-accent-fg" />
          <h1 className="text-xl font-bold text-brand-text mb-1">Lugares Destacados</h1>
          <p className="text-sm text-brand-text/70 mb-6">
            Los negocios premium de GeoKaia — con galería, video y visor 360°.
          </p>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {lugares === null && !error && (
            <p className="text-brand-text/70 animate-pulse">Cargando destacados...</p>
          )}

          {lugares?.length === 0 && (
            <p className="text-brand-text/70">
              Todavía no hay negocios premium — ¡pronto vas a encontrar los mejores acá!
            </p>
          )}

          {lugares && lugares.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {lugares.map((lugar) => (
                <div key={lugar.id} className="bg-surface border border-secondary/40 rounded-xl p-3 shadow-sm">
                  <PlaceCard lugar={lugar} ancho="w-full" />
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

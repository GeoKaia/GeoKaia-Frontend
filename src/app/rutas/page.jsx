"use client";

import { useEffect, useState } from "react";
import { Route } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteCard from "@/components/RouteCard";
import { obtenerRutas } from "@/lib/api";

export default function RutasPage() {
  const [rutas, setRutas] = useState(null); // null = cargando
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerRutas()
      .then(setRutas)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-4xl">
          <Route size={32} className="text-primary" />
          <h1 className="text-xl font-bold text-brand-text mb-1">Lista de recorridos</h1>
          <p className="text-sm text-brand-text/60 mb-6">
            Rutas temáticas curadas de GeoKaia — elegí una y mirá el detalle.
          </p>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {rutas === null && !error && (
            <p className="text-brand-text/60 animate-pulse">Cargando rutas...</p>
          )}

          {rutas?.length === 0 && (
            <p className="text-brand-text/60">Todavía no hay rutas cargadas.</p>
          )}

          {rutas && rutas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {rutas.map((ruta) => (
                <RouteCard key={ruta.id} ruta={ruta} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

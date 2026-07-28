"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { obtenerRutas } from "@/lib/api";

const MapaBase = dynamic(() => import("@/components/MapaBase"), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-center text-brand-text/60 animate-pulse">
      Cargando mapa de la ruta...
    </p>
  ),
});

export default function RutaDetallePage() {
  const { id } = useParams();
  const [ruta, setRuta] = useState(undefined); // undefined = cargando, null = no encontrada
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerRutas()
      .then((rutas) => {
        const encontrada = rutas.find((r) => String(r.id) === String(id));
        setRuta(encontrada || null);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const lugaresDeLaRuta = ruta ? ruta.paradas.map((p) => p.lugar) : [];

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {ruta === undefined && !error && (
          <p className="text-brand-text/60 animate-pulse">Cargando ruta...</p>
        )}

        {ruta === null && (
          <p className="text-brand-text/70">No encontramos esa ruta.</p>
        )}

        {ruta && (
          <div className="w-full max-w-3xl flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-brand-text">{ruta.nombre}</h1>
              <p className="text-brand-text/80 mt-2">{ruta.descripcion}</p>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-md border border-secondary/30">
              <MapaBase
                lugaresIniciales={lugaresDeLaRuta}
                rutaParadas={lugaresDeLaRuta}
                mostrarLeyenda={false}
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-brand-text/70 mb-3">
                Paradas de la ruta
              </h2>
              <div className="flex flex-col gap-3">
                {ruta.paradas.map((parada, i) => (
                  <div key={parada.id}>
                    <div className="bg-white border border-secondary/40 rounded-xl p-3">
                      <PlaceCard lugar={parada.lugar} />
                    </div>
                    {i < ruta.paradas.length - 1 && parada.minutosAlSiguiente != null && (
                      <p className="text-xs text-brand-text/50 text-center py-2">
                        🕒 {parada.minutosAlSiguiente} min al siguiente lugar ↓
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

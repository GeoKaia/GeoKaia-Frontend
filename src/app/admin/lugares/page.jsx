"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import SugerenciaNegocio from "@/components/SugerenciaNegocio";
import { obtenerTodosLosLugares } from "@/lib/api";
import { obtenerToken } from "@/lib/auth";

// Supervisión de solo lectura: el admin revisa lo que hay publicado, pero no edita ni borra lugares ajenos.
// Cada negocio administra lo suyo desde su panel; el admin solo aprueba o rechaza lo pendiente (/admin).
export default function AdminLugaresPage() {
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error
  const [lugares, setLugares] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = obtenerToken();
    if (!token) return; // el layout de /admin ya redirige al login
    obtenerTodosLosLugares(token)
      .then((data) => {
        setLugares(data);
        setEstado("listo");
      })
      .catch((err) => {
        setError(err.message);
        setEstado("error");
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main id="contenido" className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-brand-text">Todos los lugares</h1>
            <Link href="/admin" className="text-sm text-accent-fg hover:underline">
              ← Cola de aprobación
            </Link>
          </div>
          <p className="text-sm text-brand-text/70 mb-6">
            Vista de solo lectura para supervisar el contenido. Cada negocio edita y borra su propio lugar desde su panel.
          </p>

          {estado === "cargando" && <p className="text-brand-text/70 animate-pulse">Cargando...</p>}
          {estado === "error" && <p className="text-red-600 text-sm">{error}</p>}

          {estado === "listo" && (
            <div className="flex flex-col gap-4">
              {lugares.length === 0 && <p className="text-brand-text/70">Todavía no hay lugares cargados.</p>}
              {lugares.map((lugar) => (
                <div key={lugar.id} className="bg-surface border border-secondary/40 rounded-xl p-4">
                  <PlaceCard lugar={lugar} />
                  <p className="text-xs text-brand-text/70 mt-2">
                    Estado: <strong>{lugar.estado}</strong>
                    {lugar.negocio && (
                      <> · Negocio: {lugar.negocio.nombreContacto} · {lugar.negocio.email} · {lugar.negocio.whatsapp}</>
                    )}
                    {!lugar.negocio && <> · Sin negocio dueño (cargado directamente)</>}
                  </p>
                  <SugerenciaNegocio lugar={lugar} />
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

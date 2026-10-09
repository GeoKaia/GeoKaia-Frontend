"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { obtenerTodosLosLugares } from "@/lib/api";

const ESTILO_ESTADO = {
  APROBADO: "bg-green-50 text-green-700",
  PENDIENTE: "bg-amber-50 text-amber-700",
  RECHAZADO: "bg-red-50 text-red-700",
};

// Supervisión de los lugares: SOLO LECTURA. Los administradores no editan ni borran el negocio de nadie: para pedir un
// cambio se abre una conversación con el propietario y él corrige lo suyo. El servidor tampoco ofrece esas operaciones
// (src/rbac/permisos.js en el backend): esta pantalla no esconde botones, es que no existen.
export default function AdminLugaresPage() {
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error
  const [lugares, setLugares] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerTodosLosLugares()
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
          <p className="flex items-start gap-2 text-sm text-brand-text/70 mb-6">
            <Eye size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            Vista de supervisión, solo lectura. Cada negocio administra su propio lugar: si ves algo para mejorar, escribile desde la bandeja de mensajes.
          </p>

          {estado === "cargando" && <p className="text-brand-text/70 animate-pulse">Cargando...</p>}
          {estado === "error" && <p className="text-red-600 text-sm">{error}</p>}
          {estado === "listo" && lugares.length === 0 && <p className="text-brand-text/70">Todavía no hay lugares cargados.</p>}

          {estado === "listo" && lugares.length > 0 && (
            <div className="flex flex-col gap-4">
              {lugares.map((lugar) => (
                <div key={lugar.id} className="bg-surface border border-secondary/40 rounded-xl p-4">
                  <PlaceCard lugar={lugar} />
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-brand-text/70">
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${ESTILO_ESTADO[lugar.estado] || ""}`}>{lugar.estado}</span>
                    {lugar.negocio ? <span>Negocio: {lugar.negocio.nombreContacto}</span> : <span>Sin negocio propietario</span>}
                  </p>
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

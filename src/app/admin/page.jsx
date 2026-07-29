"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { obtenerLugaresPendientes, actualizarEstadoLugar } from "@/lib/api";
import { obtenerToken } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [estado, setEstado] = useState("cargando"); // cargando | sin-token | sin-permiso | listo | error
  const [pendientes, setPendientes] = useState([]);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(null); // id del lugar en proceso

  function cargar() {
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    obtenerLugaresPendientes(token)
      .then((data) => {
        setPendientes(data);
        setEstado("listo");
      })
      .catch((err) => {
        if (err.message.includes("administrador")) {
          setEstado("sin-permiso");
        } else {
          setError(err.message);
          setEstado("error");
        }
      });
  }

  useEffect(cargar, []);

  async function resolver(id, nuevoEstado) {
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }
    setProcesando(id);
    try {
      await actualizarEstadoLugar(token, id, nuevoEstado);
      setPendientes((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-3xl">
          <h1 className="text-xl font-bold text-brand-text mb-1">Cola de aprobación</h1>
          <p className="text-sm text-brand-text/60 mb-6">
            Lugares registrados por negocios, esperando revisión antes de salir al mapa público.
          </p>

          {estado === "cargando" && (
            <p className="text-brand-text/60 animate-pulse">Cargando...</p>
          )}

          {estado === "sin-token" && (
            <div>
              <p className="text-brand-text/80 mb-4">Necesitás iniciar sesión.</p>
              <button
                onClick={() => router.push("/negocio/login")}
                className="rounded-lg bg-primary text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
              >
                Iniciar sesión
              </button>
            </div>
          )}

          {estado === "sin-permiso" && (
            <p className="text-brand-text/80">Tu cuenta no tiene permisos de administrador.</p>
          )}

          {estado === "error" && <p className="text-red-600 text-sm">{error}</p>}

          {estado === "listo" && pendientes.length === 0 && (
            <p className="text-brand-text/60">No hay lugares pendientes por ahora. 🎉</p>
          )}

          {estado === "listo" && pendientes.length > 0 && (
            <div className="flex flex-col gap-4">
              {pendientes.map((lugar) => (
                <div key={lugar.id} className="bg-white border border-secondary/40 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <PlaceCard lugar={lugar} />
                    <p className="text-xs text-brand-text/50 mt-2">
                      Negocio: {lugar.negocio?.nombreContacto} · {lugar.negocio?.email} · {lugar.negocio?.whatsapp}
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => resolver(lugar.id, "APROBADO")}
                      disabled={procesando === lugar.id}
                      className="flex-1 rounded-lg bg-primary text-white text-sm font-semibold px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => resolver(lugar.id, "RECHAZADO")}
                      disabled={procesando === lugar.id}
                      className="flex-1 rounded-lg border border-red-300 text-red-700 text-sm font-semibold px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                  </div>
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

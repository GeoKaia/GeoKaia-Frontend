"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { obtenerToken, borrarToken } from "@/lib/auth";
import { eliminarCuenta } from "@/lib/api";

const PROXIMAMENTE = [
  { icono: "🌗", texto: "Modo oscuro" },
  { icono: "🔤", texto: "Tamaño de letra" },
];

export default function AjustesPage() {
  const router = useRouter();
  const [logueado, setLogueado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [password, setPassword] = useState("");
  const [borrando, setBorrando] = useState(false);
  const [errorBorrar, setErrorBorrar] = useState(null);

  useEffect(() => {
    setLogueado(!!obtenerToken());
  }, []);

  function handleLogout() {
    borrarToken();
    router.push("/");
  }

  function abrirModal() {
    setPassword("");
    setErrorBorrar(null);
    setMostrarModal(true);
  }

  function cerrarModal() {
    if (borrando) return;
    setMostrarModal(false);
  }

  async function handleBorrarCuenta(e) {
    e.preventDefault();
    const token = obtenerToken();
    if (!token) {
      setEstadoSinToken();
      return;
    }

    setBorrando(true);
    setErrorBorrar(null);
    try {
      await eliminarCuenta(token, password);
      borrarToken();
      router.push("/");
    } catch (err) {
      setErrorBorrar(err.message);
    } finally {
      setBorrando(false);
    }
  }

  function setEstadoSinToken() {
    borrarToken();
    setLogueado(false);
    setMostrarModal(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-brand-text">Ajustes</h1>

          {logueado && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-between bg-white border border-red-200 rounded-xl px-4 py-3 text-left hover:bg-red-50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-red-700">
                <span className="text-lg">🚪</span>
                Cerrar sesión
              </span>
            </button>
          )}

          <div className="flex flex-col gap-2">
            {PROXIMAMENTE.map((item) => (
              <div
                key={item.texto}
                className="flex items-center justify-between bg-white border border-secondary/40 rounded-xl px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm text-brand-text">
                  <span className="text-lg">{item.icono}</span>
                  {item.texto}
                </span>
                <span className="text-xs text-brand-text/40">Próximamente</span>
              </div>
            ))}
          </div>

          {logueado && (
            <button
              onClick={abrirModal}
              className="flex items-center justify-between bg-white border border-red-200 rounded-xl px-4 py-3 text-left hover:bg-red-50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-red-700">
                <span className="text-lg">🗑️</span>
                Borrar cuenta
              </span>
            </button>
          )}

          <div className="bg-white border border-secondary/40 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-brand-text mb-1">¿Necesitás ayuda?</p>
            <p className="text-sm text-brand-text/70">
              Escribinos a{" "}
              <a href="mailto:geokaia404@gmail.com" className="text-accent-dark underline">
                geokaia404@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5">
            <h2 className="text-lg font-bold text-brand-text mb-1">Borrar tu cuenta</h2>
            <p className="text-sm text-brand-text/70 mb-4">
              Esta acción es permanente: se elimina tu cuenta y, si tenés un lugar registrado,
              también se borra de GeoKaia. Confirmá tu contraseña para continuar.
            </p>

            <form onSubmit={handleBorrarCuenta} className="flex flex-col gap-3">
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-brand-text">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {errorBorrar && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorBorrar}</p>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={cerrarModal}
                  disabled={borrando}
                  className="flex-1 rounded-lg border border-secondary/50 text-brand-text font-medium px-4 py-2.5 hover:bg-brand-bg transition-colors disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={borrando || !password}
                  className="flex-1 rounded-lg bg-red-600 text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {borrando ? "Borrando..." : "Borrar cuenta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

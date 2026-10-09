"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoonStar, Type, LogOut, Trash2, Sparkles, ChevronRight, ShieldCheck, FileText } from "lucide-react";
import Footer from "@/components/Footer";
import { obtenerToken, borrarToken } from "@/lib/auth";
import { eliminarCuenta } from "@/lib/api";
import { useModoOscuro, useTamanoLetra } from "@/lib/usePreferencias";

const OPCIONES_TAMANO = [
  { valor: "normal", texto: "Normal", clase: "text-sm" },
  { valor: "grande", texto: "Grande", clase: "text-base" },
  { valor: "muy-grande", texto: "Muy grande", clase: "text-lg" },
];

const ENLACES_INFO = [
  { href: "/bienvenida?repetir=1", Icono: Sparkles, texto: "Ver la bienvenida otra vez" },
  { href: "/privacidad", Icono: ShieldCheck, texto: "Política de privacidad" },
  { href: "/terminos", Icono: FileText, texto: "Términos y condiciones" },
];

export default function AjustesPage() {
  const router = useRouter();
  const [oscuro, setOscuro] = useModoOscuro();
  const [tamano, setTamano] = useTamanoLetra();
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
    <div className="flex min-h-dvh flex-col bg-brand-bg">

      <main id="contenido" className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-brand-text">Ajustes</h1>

          {logueado && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-between bg-surface border border-red-200 rounded-xl px-4 py-3 text-left hover:bg-red-50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-red-700">
                <LogOut size={20} />
                Cerrar sesión
              </span>
            </button>
          )}

          <section aria-labelledby="ajustes-apariencia" className="flex flex-col gap-2">
            <h2 id="ajustes-apariencia" className="px-1 text-xs font-semibold uppercase tracking-wide text-brand-text/70">
              Apariencia y accesibilidad
            </h2>

            <div className="flex items-center justify-between gap-3 bg-surface border border-secondary/40 rounded-xl px-4 py-3">
              <span id="ajuste-oscuro" className="flex items-center gap-3 text-sm text-brand-text">
                <MoonStar size={20} aria-hidden="true" />
                Modo oscuro
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={oscuro}
                aria-labelledby="ajuste-oscuro"
                onClick={() => setOscuro(!oscuro)}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${oscuro ? "bg-accent-dark" : "bg-secondary"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${oscuro ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-3 bg-surface border border-secondary/40 rounded-xl px-4 py-3">
              <span id="ajuste-tamano" className="flex items-center gap-3 text-sm text-brand-text">
                <Type size={20} aria-hidden="true" />
                Tamaño de letra
              </span>
              <div role="group" aria-labelledby="ajuste-tamano" className="grid grid-cols-3 gap-2">
                {OPCIONES_TAMANO.map((op) => (
                  <button
                    key={op.valor}
                    type="button"
                    aria-pressed={tamano === op.valor}
                    onClick={() => setTamano(op.valor)}
                    className={`min-h-11 rounded-lg border px-2 py-2 font-semibold transition-colors ${op.clase} ${
                      tamano === op.valor
                        ? "border-accent-dark bg-accent-dark text-white"
                        : "border-secondary/60 text-brand-text hover:bg-brand-bg"
                    }`}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="ajustes-info" className="flex flex-col gap-2">
            <h2 id="ajustes-info" className="px-1 text-xs font-semibold uppercase tracking-wide text-brand-text/70">
              Información
            </h2>
            {ENLACES_INFO.map(({ href, Icono, texto }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between bg-surface border border-secondary/40 rounded-xl px-4 py-3 hover:bg-brand-bg transition-colors"
              >
                <span className="flex items-center gap-3 text-sm text-brand-text">
                  <Icono size={20} aria-hidden="true" />
                  {texto}
                </span>
                <ChevronRight size={18} className="text-brand-text/70" aria-hidden="true" />
              </Link>
            ))}
          </section>

          {logueado && (
            <button
              onClick={abrirModal}
              className="flex items-center justify-between bg-surface border border-red-200 rounded-xl px-4 py-3 text-left hover:bg-red-50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-red-700">
                <Trash2 size={20} />
                Borrar cuenta
              </span>
            </button>
          )}

          <div className="bg-surface border border-secondary/40 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-brand-text mb-1">¿Necesitás ayuda?</p>
            <p className="text-sm text-brand-text/70">
              Escribinos a{" "}
              <a href="mailto:geokaia404@gmail.com" className="text-accent-fg underline">
                geokaia404@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-surface p-5">
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

"use client";

import { useState } from "react";
import { KeyRound, ChevronDown, ChevronUp } from "lucide-react";
import CampoContrasena from "@/components/CampoContrasena";
import RequisitosContrasena from "@/components/RequisitosContrasena";
import { cambiarPassword } from "@/lib/api";
import { validarPassword } from "@/lib/password";

// Cambiar la propia contraseña (Ajustes, con sesión). Pide la contraseña actual y el código de Google Authenticator;
// el servidor aplica la política, cierra las demás sesiones y avisa por correo.
export default function CambiarPassword() {
  const [abierto, setAbierto] = useState(false);
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setOk(false);
    if (!actual) {
      setError("Escribí tu contraseña actual.");
      return;
    }
    const errorPassword = validarPassword(nueva);
    if (errorPassword) {
      setError(errorPassword);
      return;
    }
    if (!/^\d{6}$/.test(codigo)) {
      setError("El código debe tener 6 dígitos.");
      return;
    }
    setEnviando(true);
    try {
      await cambiarPassword({ passwordActual: actual, passwordNueva: nueva, codigo2fa: codigo });
      setActual("");
      setNueva("");
      setCodigo("");
      setOk(true);
    } catch (err) {
      // No se borra lo escrito: la persona corrige lo que falta sin volver a empezar.
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-surface border border-secondary/40 rounded-xl px-4 py-3">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="flex w-full items-center justify-between text-sm text-brand-text"
      >
        <span className="flex items-center gap-3">
          <KeyRound size={20} aria-hidden="true" />
          Cambiar contraseña
        </span>
        {abierto ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
      </button>

      {abierto && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="pw-actual" className="mb-1 block text-sm font-medium text-brand-text">
              Contraseña actual
            </label>
            <CampoContrasena id="pw-actual" name="passwordActual" autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} placeholder="Tu contraseña actual" />
          </div>
          <div>
            <label htmlFor="pw-nueva" className="mb-1 block text-sm font-medium text-brand-text">
              Contraseña nueva
            </label>
            <CampoContrasena id="pw-nueva" name="passwordNueva" autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Mínimo 12 caracteres" />
            <RequisitosContrasena password={nueva} />
          </div>
          <div>
            <label htmlFor="pw-codigo" className="mb-1 block text-sm font-medium text-brand-text">
              Código de Google Authenticator
            </label>
            <input
              id="pw-codigo"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-center text-lg tracking-[0.5em] text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="000000"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {ok && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
              Listo: cambiaste tu contraseña y cerramos tus otras sesiones.
            </p>
          )}
          <button
            type="submit"
            disabled={enviando}
            className="rounded-lg bg-accent-dark px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      )}
    </div>
  );
}

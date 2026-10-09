"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthHero from "@/components/AuthHero";
import CampoContrasena from "@/components/CampoContrasena";
import RequisitosContrasena from "@/components/RequisitosContrasena";
import { restablecerPassword } from "@/lib/api";
import { validarPassword } from "@/lib/password";

function Restablecer() {
  const params = useSearchParams();
  // El token se guarda en memoria y se quita de la barra de direcciones para que no quede en el historial ni se copie
  // sin querer al compartir la pantalla.
  const [token] = useState(() => params.get("token"));
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const errorPassword = validarPassword(password);
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
      await restablecerPassword({ token, password, codigo2fa: codigo });
      setPassword("");
      setCodigo("");
      setListo(true);
    } catch (err) {
      // Se muestra el motivo, sin borrar lo que la persona escribió (salvo en el éxito).
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (!token) {
    return (
      <AuthHero eyebrow="Tu cuenta" title="Enlace no válido" tone="negocio">
        <div className="text-center">
          <p className="mb-4 text-sm text-brand-text">Este enlace no es válido o ya venció. Pedí uno nuevo.</p>
          <Link href="/olvide-password" className="text-sm font-semibold text-accent-fg hover:underline">
            Pedir un enlace nuevo
          </Link>
        </div>
      </AuthHero>
    );
  }

  if (listo) {
    return (
      <AuthHero eyebrow="Tu cuenta" title="Contraseña restablecida" tone="negocio">
        <div className="text-center">
          <p className="mb-4 text-sm text-brand-text">Cerramos todas tus sesiones abiertas. Iniciá sesión con tu contraseña nueva.</p>
          <Link href="/negocio/login" className="inline-block w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark">
            Iniciar sesión
          </Link>
        </div>
      </AuthHero>
    );
  }

  return (
    <AuthHero eyebrow="Tu cuenta" title="Elegí tu contraseña nueva" subtitle="Vas a necesitar tu código de Google Authenticator." tone="negocio">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-brand-text">
            Contraseña nueva
          </label>
          <CampoContrasena id="password" name="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 12 caracteres" />
          <RequisitosContrasena password={password} />
        </div>
        <div>
          <label htmlFor="codigo" className="mb-1 block text-sm font-medium text-brand-text">
            Código de verificación
          </label>
          <input
            id="codigo"
            name="codigo"
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
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? "Guardando..." : "Restablecer contraseña"}
        </button>
      </form>
    </AuthHero>
  );
}

export default function RestablecerPasswordPage() {
  return (
    <Suspense fallback={null}>
      <Restablecer />
    </Suspense>
  );
}

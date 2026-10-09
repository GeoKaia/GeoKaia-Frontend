"use client";

import { useState } from "react";
import Link from "next/link";
import AuthHero from "@/components/AuthHero";
import { olvidePassword } from "@/lib/api";

// Pedir el enlace para restablecer la contraseña. La respuesta es siempre la misma exista o no la cuenta: la pantalla
// tampoco debe sugerir nada distinto (así no sirve para descubrir qué correos tienen cuenta).
export default function OlvidePasswordPage() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Escribí tu correo.");
      return;
    }
    setEnviando(true);
    try {
      await olvidePassword(email.trim());
      setEnviado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthHero eyebrow="Tu cuenta" title="Restablecé tu contraseña" subtitle="Te enviamos un enlace a tu correo." tone="negocio">
      {enviado ? (
        <div className="text-center">
          <p className="mb-4 text-sm text-brand-text">
            Si el correo está registrado, te enviamos las instrucciones para restablecer la contraseña. El enlace vale 30 minutos y se
            usa una sola vez. Vas a necesitar tu código de Google Authenticator.
          </p>
          <Link href="/negocio/login" className="text-sm font-semibold text-accent-fg hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-brand-text">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="tunegocio@correo.com"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Enviar enlace"}
          </button>
          <Link href="/negocio/login" className="text-center text-sm text-brand-text/70 hover:underline">
            Volver
          </Link>
        </form>
      )}
    </AuthHero>
  );
}

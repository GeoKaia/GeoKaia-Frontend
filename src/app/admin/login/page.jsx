"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginNegocio, verificar2FA } from "@/lib/api";
import { guardarToken } from "@/lib/auth";
import CampoContrasena from "@/components/CampoContrasena";
import AuthHero from "@/components/AuthHero";

// Mismo flujo que /negocio/login (misma cuenta, mismo backend), pero con otra
// paleta a propósito para que se note de un vistazo que es el acceso de admin.
export default function LoginAdminPage() {
  const router = useRouter();
  const [step, setStep] = useState("credenciales"); // 'credenciales' | 'codigo'
  const [credenciales, setCredenciales] = useState({ email: "", password: "" });
  const [negocioId, setNegocioId] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleCredencialesChange(e) {
    const { name, value } = e.target;
    setCredenciales((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!credenciales.email.trim() || !credenciales.password) {
      setError("Completá tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginNegocio(credenciales);
      setNegocioId(data.negocioId);
      setStep("codigo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCodigoSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(codigo)) {
      setError("El código debe tener 6 dígitos.");
      return;
    }

    setLoading(true);
    try {
      const data = await verificar2FA({ negocioId, token: codigo });
      guardarToken(data.token);
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthHero
      eyebrow="🛡️ Acceso administrador"
      title={step === "credenciales" ? "Iniciá sesión" : "Verificación en dos pasos"}
      subtitle={step === "credenciales" ? "Solo para cuentas del equipo de GeoKaia." : undefined}
      tone="admin"
    >
        {step === "credenciales" ? (
          <>
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-brand-text">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={credenciales.email}
                  onChange={handleCredencialesChange}
                  className="w-full rounded-lg border border-accent/40 px-3 py-2 text-brand-text outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark"
                  placeholder="tucuenta@geokaia.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-brand-text">
                  Contraseña
                </label>
                <CampoContrasena
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={credenciales.password}
                  onChange={handleCredencialesChange}
                  placeholder="Tu contraseña"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-accent-dark px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verificando..." : "Continuar"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-brand-text/70">
              Ingresá el código de 6 dígitos de tu app Google Authenticator.
            </p>

            <form onSubmit={handleCodigoSubmit} className="flex flex-col gap-4">
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
                  className="w-full rounded-lg border border-accent/40 px-3 py-2 text-center text-lg tracking-[0.5em] text-brand-text outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark"
                  placeholder="000000"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-accent-dark px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verificando..." : "Verificar y entrar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("credenciales");
                  setError(null);
                  setCodigo("");
                  setCredenciales((prev) => ({ ...prev, password: "" }));
                }}
                className="text-sm text-brand-text/60 hover:underline"
              >
                Volver
              </button>
            </form>
          </>
        )}
    </AuthHero>
  );
}

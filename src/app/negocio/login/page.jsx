"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginNegocio, verificar2FA } from "@/lib/api";
import { guardarToken } from "@/lib/auth";

export default function LoginNegocioPage() {
  const router = useRouter();
  const [step, setStep] = useState("credenciales"); // 'credenciales' | 'codigo' | 'listo'
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
      setStep("listo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (step === "listo") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-secondary/40 bg-white p-8 text-center shadow-lg">
          <h1 className="mb-2 text-2xl font-bold text-accent-dark">
            ¡Sesión iniciada!
          </h1>
          <p className="text-sm text-brand-text/70 mb-6">
            Tu sesión es válida por 8 horas. Ya podés acceder al panel de tu negocio.
          </p>
          <button
            onClick={() => router.push("/panel-negocio")}
            className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark"
          >
            Ir a mi panel
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-secondary/40 bg-white p-8 shadow-lg">
        {step === "credenciales" ? (
          <>
            <h1 className="mb-1 text-2xl font-bold text-accent-dark">
              Iniciá sesión
            </h1>
            <p className="mb-6 text-sm text-brand-text/70">
              Accedé al panel de tu negocio en GeoKaia.
            </p>

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
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="tunegocio@correo.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-brand-text">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={credenciales.password}
                  onChange={handleCredencialesChange}
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Tu contraseña"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verificando..." : "Continuar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-brand-text/70">
              ¿No tenés cuenta?{" "}
              <Link href="/negocio/registro" className="font-semibold text-accent hover:underline">
                Registrá tu negocio
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-2xl font-bold text-accent-dark">
              Verificación en dos pasos
            </h1>
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
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-center text-lg tracking-[0.5em] text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="000000"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verificando..." : "Verificar y entrar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("credenciales");
                  setError(null);
                  setCodigo("");
                }}
                className="text-sm text-brand-text/60 hover:underline"
              >
                Volver
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

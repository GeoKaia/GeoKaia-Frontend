"use client";

import { useState } from "react";
import Link from "next/link";
import { registrarNegocio } from "@/lib/api";
import CampoContrasena from "@/components/CampoContrasena";
import AuthHero from "@/components/AuthHero";
import RequisitosContrasena from "@/components/RequisitosContrasena";
import { contrasenaValida } from "@/lib/password";

const initialForm = {
  email: "",
  password: "",
  nombreContacto: "",
  whatsapp: "",
  aceptaTerminos: false,
};

function validar(form) {
  if (!form.email.trim()) return "El correo es obligatorio.";
  if (!contrasenaValida(form.password))
    return "La contraseña debe tener al menos 12 caracteres, una mayúscula, un número y un símbolo.";
  if (!form.nombreContacto.trim() || form.nombreContacto.trim().length < 3)
    return "El nombre de contacto debe tener al menos 3 caracteres.";
  if (!form.whatsapp.trim() || form.whatsapp.trim().length < 8)
    return "El número de WhatsApp debe tener al menos 8 caracteres.";
  if (!form.aceptaTerminos)
    return "Tenés que aceptar los Términos y la Política de Privacidad para crear tu cuenta.";
  return null;
}

export default function RegistroNegocioPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null); // { qr, negocioId, mensaje }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const errorValidacion = validar(form);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);
    try {
      const data = await registrarNegocio(form);
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (resultado) {
    return (
      <AuthHero eyebrow="Para negocios" title="¡Cuenta creada!" tone="negocio">
        <div className="text-center">
          <p className="mb-6 text-sm text-brand-text">
            {resultado.mensaje || "Escaneá este código con Google Authenticator para activar la verificación en dos pasos."}
          </p>

          {resultado.qr && (
            <img
              src={resultado.qr}
              alt="Código QR para configurar Google Authenticator"
              className="mx-auto mb-6 h-56 w-56 rounded-lg border border-accent/20 p-2"
            />
          )}

          <p className="mb-6 text-xs text-brand-text/70">
            Después de escanear el código, iniciá sesión con tu correo y contraseña.
          </p>

          <Link
            href="/negocio/login"
            className="inline-block w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </AuthHero>
    );
  }

  return (
    <AuthHero
      eyebrow="Para negocios"
      title="Registrá tu negocio"
      subtitle="Creá tu cuenta para aparecer en el mapa de GeoKaia."
      tone="negocio"
    >
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
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="tunegocio@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-brand-text">
              Contraseña
            </label>
            <CampoContrasena
              id="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 12 caracteres"
            />
            <RequisitosContrasena password={form.password} />
          </div>

          <div>
            <label htmlFor="nombreContacto" className="mb-1 block text-sm font-medium text-brand-text">
              Nombre de contacto
            </label>
            <input
              id="nombreContacto"
              name="nombreContacto"
              type="text"
              value={form.nombreContacto}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Nombre y apellido"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium text-brand-text">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="+505 8888 8888"
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="aceptaTerminos"
              name="aceptaTerminos"
              type="checkbox"
              checked={form.aceptaTerminos}
              onChange={handleChange}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-accent-dark)]"
            />
            <label htmlFor="aceptaTerminos" className="text-sm leading-snug text-brand-text">
              Leí y acepto los{" "}
              <Link href="/terminos" target="_blank" className="font-semibold text-accent-fg underline underline-offset-2">
                Términos y Condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" target="_blank" className="font-semibold text-accent-fg underline underline-offset-2">
                Política de Privacidad
              </Link>
              .
            </label>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-text/70">
          ¿Ya tenés cuenta?{" "}
          <Link href="/negocio/login" className="font-semibold text-accent-fg hover:underline">
            Iniciar sesión
          </Link>
        </p>
    </AuthHero>
  );
}

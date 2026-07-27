"use client";

import { useState } from "react";
import { crearLead } from "@/lib/api";

const initialForm = {
  nombreNegocio: "",
  nombreContacto: "",
  whatsapp: "",
  mensaje: "",
};

function validar(form) {
  if (!form.nombreNegocio.trim() || form.nombreNegocio.trim().length < 3)
    return "El nombre del negocio debe tener al menos 3 caracteres.";
  if (!form.nombreContacto.trim() || form.nombreContacto.trim().length < 3)
    return "El nombre de contacto debe tener al menos 3 caracteres.";
  if (!form.whatsapp.trim() || form.whatsapp.trim().length < 8)
    return "El número de WhatsApp debe tener al menos 8 caracteres.";
  return null;
}

export default function LeadsPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      await crearLead({
        ...form,
        mensaje: form.mensaje.trim() || undefined,
      });
      setEnviado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-[#D9A15B]/40 bg-white p-8 text-center shadow-lg">
          <h1 className="mb-2 text-2xl font-bold text-[#0F3D4A]">
            ¡Gracias por tu interés!
          </h1>
          <p className="text-sm text-[#2B2B2B]/70">
            Nuestro equipo se va a poner en contacto por WhatsApp para contarte
            más sobre el plan premium de GeoKaia.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#D9A15B]/40 bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold text-[#0F3D4A]">
          Quiero saber más
        </h1>
        <p className="mb-6 text-sm text-[#2B2B2B]/70">
          Dejanos tus datos y te contactamos sobre el plan premium para tu negocio.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="nombreNegocio" className="mb-1 block text-sm font-medium text-[#2B2B2B]">
              Nombre del negocio
            </label>
            <input
              id="nombreNegocio"
              name="nombreNegocio"
              type="text"
              value={form.nombreNegocio}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#D9A15B]/50 px-3 py-2 text-[#2B2B2B] outline-none focus:border-[#B8722E] focus:ring-1 focus:ring-[#B8722E]"
              placeholder="Mi negocio"
            />
          </div>

          <div>
            <label htmlFor="nombreContacto" className="mb-1 block text-sm font-medium text-[#2B2B2B]">
              Nombre de contacto
            </label>
            <input
              id="nombreContacto"
              name="nombreContacto"
              type="text"
              value={form.nombreContacto}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#D9A15B]/50 px-3 py-2 text-[#2B2B2B] outline-none focus:border-[#B8722E] focus:ring-1 focus:ring-[#B8722E]"
              placeholder="Nombre y apellido"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium text-[#2B2B2B]">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#D9A15B]/50 px-3 py-2 text-[#2B2B2B] outline-none focus:border-[#B8722E] focus:ring-1 focus:ring-[#B8722E]"
              placeholder="+505 8888 8888"
            />
          </div>

          <div>
            <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-[#2B2B2B]">
              Mensaje <span className="text-[#2B2B2B]/50">(opcional)</span>
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={3}
              value={form.mensaje}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#D9A15B]/50 px-3 py-2 text-[#2B2B2B] outline-none focus:border-[#B8722E] focus:ring-1 focus:ring-[#B8722E]"
              placeholder="Contanos qué te gustaría saber"
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
            className="mt-2 rounded-lg bg-[#B8722E] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0F3D4A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </main>
  );
}

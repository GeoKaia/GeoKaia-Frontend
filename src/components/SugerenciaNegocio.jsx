"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";

const MAX_CARACTERES = 500;

// Caja de sugerencias del administrador para el dueño de un lugar. El admin no edita el negocio de nadie:
// escribe una sugerencia y se abre WhatsApp con el mensaje ya redactado hacia el contacto del negocio.
// No se guarda nada en GeoKaia; el dueño decide si la aplica.
export default function SugerenciaNegocio({ lugar }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");

  const numero = String(lugar.negocio?.whatsapp || lugar.whatsapp || "").replace(/\D/g, "");
  const numeroValido = numero.length >= 8 && numero.length <= 15;
  const saludo = lugar.negocio?.nombreContacto ? `Hola ${lugar.negocio.nombreContacto}` : "Hola";

  function enviar() {
    const mensaje = `${saludo}, te escribimos del equipo de GeoKaia. Revisando "${lugar.nombre}" te dejamos una sugerencia:\n\n${texto.trim()}\n\nTú decides si aplicarla desde tu panel. ¡Gracias!`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
    setTexto("");
    setAbierto(false);
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-fg hover:underline"
      >
        <MessageSquareText size={14} aria-hidden="true" /> Enviar sugerencia al negocio
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-secondary/40 bg-brand-bg p-3">
      <label htmlFor={`sugerencia-${lugar.id}`} className="mb-1 block text-sm font-medium text-brand-text">
        Sugerencia para {lugar.nombre}
      </label>
      <textarea
        id={`sugerencia-${lugar.id}`}
        value={texto}
        onChange={(e) => setTexto(e.target.value.slice(0, MAX_CARACTERES))}
        rows={3}
        maxLength={MAX_CARACTERES}
        placeholder="Ej.: La foto principal se ve borrosa; ¿podés subir una más nítida?"
        className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <div className="mt-1 flex items-center justify-between text-xs text-brand-text/70">
        <span>
          {texto.length}/{MAX_CARACTERES}
        </span>
        {!numeroValido && <span className="text-red-700">Este negocio no tiene un WhatsApp válido.</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={enviar}
          disabled={!numeroValido || texto.trim().length < 5}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Abrir WhatsApp
        </button>
        <button
          type="button"
          onClick={() => {
            setAbierto(false);
            setTexto("");
          }}
          className="text-sm text-brand-text/70 underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

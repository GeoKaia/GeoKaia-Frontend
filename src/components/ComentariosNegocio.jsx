"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { obtenerComentariosLugar, crearComentarioLugar, eliminarComentarioLugar } from "@/lib/api";

export function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-NI", { day: "numeric", month: "short", year: "numeric" });
}

// [Admin] Notas para el dueño de un lugar. Reemplaza a editar el lugar de otra persona: el equipo deja el
// comentario (qué corregir, por qué se rechazó) y el negocio lo ve en su panel y lo corrige él mismo.
export default function ComentariosNegocio({ lugarId }) {
  const [abierto, setAbierto] = useState(false);
  const [comentarios, setComentarios] = useState(null); // null = todavía no se cargó
  const [error, setError] = useState(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!abierto || comentarios !== null) return;
    obtenerComentariosLugar(lugarId)
      .then(setComentarios)
      .catch((err) => setError(err.message));
  }, [abierto, comentarios, lugarId]);

  async function handleEnviar(e) {
    e.preventDefault();
    const limpio = texto.trim();
    if (limpio.length < 3) {
      setError("El comentario debe tener al menos 3 caracteres.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const { comentario } = await crearComentarioLugar(lugarId, limpio);
      setComentarios((prev) => [comentario, ...(prev || [])]);
      setTexto("");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleBorrar(id) {
    try {
      await eliminarComentarioLugar(id);
      setComentarios((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mt-3 border-t border-secondary/30 pt-3">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="flex items-center gap-1.5 text-sm font-semibold text-accent-fg hover:underline"
      >
        <MessageSquare size={14} aria-hidden="true" />
        Comentarios para el negocio
        {comentarios?.length > 0 && <span className="text-xs font-normal text-brand-text/70">({comentarios.length})</span>}
        {abierto ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
      </button>

      {abierto && (
        <div className="mt-3 flex flex-col gap-3">
          <form onSubmit={handleEnviar} className="flex flex-col gap-2">
            <label htmlFor={`comentario-${lugarId}`} className="text-xs text-brand-text/70">
              El negocio lo ve en su panel y lo corrige él mismo. No se edita su lugar.
            </label>
            <textarea
              id={`comentario-${lugarId}`}
              rows={3}
              maxLength={1000}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ej. La foto principal no se ve, ¿podés subir otra?"
              className="w-full rounded-lg border border-secondary/50 bg-surface px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={enviando}
              className="self-start flex items-center gap-1.5 rounded-lg bg-accent-dark text-white text-sm font-semibold px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <Send size={14} aria-hidden="true" />
              {enviando ? "Enviando..." : "Enviar comentario"}
            </button>
          </form>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          {comentarios === null && !error && <p className="text-xs text-brand-text/70 animate-pulse">Cargando...</p>}
          {comentarios?.length === 0 && <p className="text-xs text-brand-text/70">Todavía no hay comentarios.</p>}

          {comentarios?.map((c) => (
            <div key={c.id} className="rounded-lg bg-secondary/15 px-3 py-2 text-sm text-brand-text">
              <p className="whitespace-pre-wrap">{c.texto}</p>
              <p className="mt-1 flex items-center justify-between text-xs text-brand-text/70">
                <span>
                  {c.autorEmail} · {formatearFecha(c.createdAt)}
                </span>
                <button
                  type="button"
                  onClick={() => handleBorrar(c.id)}
                  aria-label="Borrar comentario"
                  className="text-red-700 hover:underline"
                >
                  <Trash2 size={12} aria-hidden="true" />
                </button>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

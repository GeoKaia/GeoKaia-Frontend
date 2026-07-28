"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { recomendarRuta } from "@/lib/api";

const MENSAJE_INICIAL = "Soy Kaia, tu guía turístico. ¿Qué clase de recorrido te gustaría disfrutar?";

export default function ChatKaia() {
  const [consulta, setConsulta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null); // { mensaje, recomendaciones }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consulta.trim() || cargando) return;

    setCargando(true);
    setError(null);
    try {
      const data = await recomendarRuta(consulta.trim());
      setRespuesta(data);
      setConsulta("");
    } catch (err) {
      setError(err.message);
      setRespuesta(null);
    } finally {
      setCargando(false);
    }
  }

  const mensajeKaia = error
    ? "Uy, no pude pensar una recomendación ahora mismo. ¿Probamos de nuevo?"
    : respuesta?.mensaje || MENSAJE_INICIAL;

  return (
    <section className="w-full max-w-2xl flex items-start gap-3 px-4">
      <Image
        src="/icons/kaia-mascota.png"
        alt="Kaia"
        width={48}
        height={48}
        className="shrink-0 rounded-full bg-accent/10"
      />

      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-white border border-secondary/40 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
          <p className="text-sm text-brand-text">
            {cargando ? "Dejame pensar un momento..." : mensajeKaia}
          </p>
        </div>

        {!cargando && respuesta?.recomendaciones?.length > 0 && (
          <div className="flex flex-col gap-2">
            {respuesta.recomendaciones.map((rec) => (
              <Link
                key={rec.rutaId}
                href={`/rutas/${rec.rutaId}`}
                className="block bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-xl px-4 py-3 transition-colors"
              >
                <p className="text-sm font-semibold text-accent-dark">{rec.nombre}</p>
                <p className="text-xs text-brand-text/70 mt-0.5">{rec.razon}</p>
              </Link>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            disabled={cargando}
            placeholder="Escribe acá..."
            className="w-full rounded-full border border-secondary/50 px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/40 bg-white outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-60"
          />
        </form>
      </div>
    </section>
  );
}

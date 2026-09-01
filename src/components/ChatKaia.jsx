"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { recomendarRuta } from "@/lib/api";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const MENSAJE_INICIAL = "Soy Kaia, tu guía turístico. ¿Qué clase de recorrido te gustaría disfrutar?";

export default function ChatKaia() {
  const [consulta, setConsulta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null); // { mensaje, recomendaciones }

  // Entrada animada de Kaia al cargar la home: la mascota "aparece" con un pop,
  // seguida de la burbuja de texto y el input, en cascada. Solo se juega una vez
  // al montar — corre antes del primer paint (useLayoutEffect) para que no haya
  // un flash del contenido ya visible antes de animarlo.
  const mascotaRef = useRef(null);
  const burbujaRef = useRef(null);
  const formRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const elementos = [mascotaRef.current, burbujaRef.current, formRef.current].filter(Boolean);
    if (elementos.length === 0) return;

    const prefiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefiereMenosMovimiento) return;

    const tl = gsap.timeline();
    tl.fromTo(
      mascotaRef.current,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.55)" }
    )
      .fromTo(burbujaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.25")
      .fromTo(formRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");

    return () => tl.kill();
  }, []);

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
    <section className="w-full max-w-2xl px-4">
      <div className="rounded-3xl bg-gradient-to-br from-accent/15 via-secondary/10 to-primary/10 px-4 pt-6 pb-4 flex flex-col items-center">
        <Image
          ref={mascotaRef}
          src="/icons/kaia-mascota.png"
          alt="Kaia"
          width={96}
          height={96}
          className="rounded-full bg-white shadow-md"
          priority
        />

        <div className="mt-4 w-full flex flex-col gap-2">
          <div ref={burbujaRef} className="bg-white border border-secondary/40 rounded-2xl px-4 py-3 shadow-sm text-center">
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

          <form ref={formRef} onSubmit={handleSubmit}>
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
      </div>
    </section>
  );
}

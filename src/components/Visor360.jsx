"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import "pannellum/build/pannellum.css";
import { tipoPanorama, urlIncrustada } from "@/lib/panorama";

// Visor 360° en una ventana sobre la página. Según el tipo de link usa Pannellum (foto 360) o un iframe
// (video 360 de YouTube o recorrido virtual de otro servicio). Siempre ofrece abrirlo en otra pestaña,
// porque algunos servicios no permiten incrustarse y el iframe quedaría en blanco sin avisar.

function PanoramaImagen({ url, titulo, onError }) {
  const contenedor = useRef(null);
  // onError llega como función nueva en cada render: va en un ref para no reconstruir el visor.
  const alFallar = useRef(onError);
  useEffect(() => {
    alFallar.current = onError;
  });

  useEffect(() => {
    let visor;
    let cancelado = false;
    import("pannellum/build/pannellum.js")
      .then(() => {
        if (cancelado || !contenedor.current) return;
        visor = window.pannellum.viewer(contenedor.current, {
          type: "equirectangular",
          panorama: url,
          autoLoad: true,
          autoRotate: -2,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          hfov: 100,
          strings: {
            loadButtonLabel: "Tocá para cargar el panorama",
            loadingLabel: "Cargando...",
            bylineLabel: "",
            noPanoramaError: "No se pudo cargar la foto 360°.",
            fileAccessError: "No se pudo cargar la foto 360°.",
            malformedURLError: "El link de la foto 360° no es válido.",
            iOS8WebGLError: "Este dispositivo no puede mostrar fotos 360°.",
            genericWebGLError: "Tu navegador no puede mostrar fotos 360°.",
            textureSizeError: "La foto 360° es demasiado grande para este dispositivo.",
          },
        });
        visor.on("error", () => alFallar.current());
      })
      .catch(() => alFallar.current());
    return () => {
      cancelado = true;
      try {
        visor?.destroy();
      } catch {}
    };
  }, [url, titulo]);

  return <div ref={contenedor} className="h-full w-full" />;
}

export default function Visor360({ url, titulo, onCerrar }) {
  const tipo = tipoPanorama(url);
  const incrustada = urlIncrustada(url);
  const botonCerrar = useRef(null);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    const previo = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botonCerrar.current?.focus();
    const alTeclear = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = overflow;
      previo?.focus?.();
    };
  }, [onCerrar]);

  if (typeof document === "undefined" || !tipo) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista 360° de ${titulo}`}
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 p-0 sm:p-6"
      onClick={onCerrar}
    >
      <div
        className="flex h-full w-full max-w-5xl flex-col overflow-hidden bg-surface text-brand-text shadow-2xl sm:h-[85vh] sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-secondary/40 px-4 py-2">
          <h2 className="min-w-0 flex-1 truncate text-sm font-bold">360° · {titulo}</h2>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded px-2 py-1.5 text-xs text-accent-fg underline underline-offset-2"
          >
            <ExternalLink size={14} /> Abrir en otra pestaña
          </a>
          <button
            ref={botonCerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar vista 360°"
            className="rounded p-2 text-brand-text hover:bg-secondary/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 bg-black">
          {tipo === "imagen" && !fallo && (
            <PanoramaImagen url={incrustada} titulo={titulo} onError={() => setFallo(true)} />
          )}
          {tipo === "imagen" && fallo && (
            <p className="flex h-full items-center justify-center px-6 text-center text-sm text-white">
              No pudimos mostrar la foto 360° acá. Probá con &ldquo;Abrir en otra pestaña&rdquo;.
            </p>
          )}
          {tipo !== "imagen" && (
            <iframe
              src={incrustada}
              title={`Vista 360° de ${titulo}`}
              className="h-full w-full border-0"
              allow="fullscreen; gyroscope; accelerometer; xr-spatial-tracking; autoplay; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

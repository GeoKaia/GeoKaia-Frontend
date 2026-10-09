"use client";

import { useState } from "react";
import Image from "next/image";

// Foto que viene de una URL escrita por un negocio. Las de Wikimedia Commons pasan por el optimizador de Next
// (se redimensionan, se sirven en AVIF/WebP y se cachean desde nuestro propio dominio: antes cada tarjeta bajaba
// el original de varios MB y sumaba cookies de terceros). Cualquier otra URL (Drive, Dropbox, Imgur...) no se
// puede optimizar sin listar todos los dominios posibles, así que se carga directo pero diferida (lazy).
// El contenedor tiene que ser `relative` y con alto fijo: la imagen lo rellena.
const HOSTS_OPTIMIZABLES = new Set(["commons.wikimedia.org", "upload.wikimedia.org"]);

function aOptimizable(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" || !HOSTS_OPTIMIZABLES.has(u.hostname)) return null;
    // Special:FilePath sin ancho devuelve el original (a veces 5-10 MB): se pide la miniatura de 960 px, uno de los
    // anchos estándar de Wikimedia (los demás se redondean a ese).
    if (u.hostname === "commons.wikimedia.org" && !u.searchParams.has("width")) u.searchParams.set("width", "960");
    return u.href;
  } catch {
    return null;
  }
}

export default function ImagenRemota({ src, alt, sizes, className = "", onError, prioridad = false }) {
  const optimizada = aOptimizable(src);
  // Wikimedia genera cada miniatura la primera vez que alguien la pide y tarda unos segundos: el optimizador de
  // Next se rinde a los pocos segundos (504) pero Wikimedia sigue trabajando, así que el segundo intento ya sale
  // al instante. Por eso un error se reintenta una vez antes de darlo por perdido.
  const [reintento, setReintento] = useState(0);

  const alFallar = () => {
    if (reintento === 0) setTimeout(() => setReintento(1), 2500);
    else onError?.();
  };

  if (optimizada) {
    return (
      <Image
        key={reintento}
        src={optimizada}
        alt={alt}
        fill
        sizes={sizes}
        priority={prioridad}
        onError={alFallar}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={prioridad ? "eager" : "lazy"}
      decoding="async"
      onError={onError}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

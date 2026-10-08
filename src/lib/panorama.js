// Qué tipo de "URL del visor 360°" cargó el negocio, para elegir cómo mostrarla:
//  - "imagen": foto equirectangular (JPG/PNG/WebP, o una de Drive/Dropbox/Wikimedia) → visor Pannellum.
//  - "youtube": video 360 de YouTube → se incrusta (en el reproductor se arrastra para mirar alrededor).
//  - "web": cualquier otro recorrido virtual (Travvir, Kuula, Matterport, Google...) → se incrusta tal cual.

import { normalizarUrlImagen } from "./imagenes";

const EXTENSION_IMAGEN = /\.(jpe?g|png|webp)(\?.*)?$/i;
const HOSTS_IMAGEN = ["drive.google.com", "dropbox.com", "dl.dropboxusercontent.com", "wikimedia.org"];

function hostDe(url) {
  try {
    const u = new URL(url);
    // Solo http(s): cualquier otro esquema (javascript:, data:) no es un recorrido 360° válido.
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// Devuelve el id de un video de YouTube a partir de sus formas de link habituales, o null.
export function idYoutube(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return u.pathname.slice(1) || null;
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      return m ? m[1] : null;
    }
  } catch {}
  return null;
}

export function tipoPanorama(url) {
  if (!url) return null;
  if (idYoutube(url)) return "youtube";
  const host = hostDe(url);
  if (!host) return null;
  if (EXTENSION_IMAGEN.test(url) || HOSTS_IMAGEN.some((h) => host === h || host.endsWith("." + h))) {
    return "imagen";
  }
  return "web";
}

// Dirección que se pone en el <iframe> (o en Pannellum) para cada tipo.
export function urlIncrustada(url) {
  const tipo = tipoPanorama(url);
  if (tipo === "youtube") return `https://www.youtube.com/embed/${idYoutube(url)}?rel=0`;
  if (tipo === "imagen") return normalizarUrlImagen(url);
  return url;
}

// Los servicios de recorridos virtuales suelen dar un código para incrustar (<iframe src="...">) además
// del link. Si la persona pega el código completo, se queda solo con la dirección del src.
export function normalizarUrlPanorama(valor) {
  const limpio = (valor || "").trim();
  const iframe = limpio.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return iframe ? iframe[1].trim() : limpio;
}

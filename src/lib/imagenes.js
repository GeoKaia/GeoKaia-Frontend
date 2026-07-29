// Convierte links de "compartir" comunes (Drive, Dropbox) a un link directo a la imagen.
// Sin esto, un <img> recibe una página HTML en vez de bytes de imagen y no renderiza nada.
export function normalizarUrlImagen(url) {
  if (!url) return url;
  const limpio = url.trim();

  const drive =
    limpio.match(/drive\.google\.com\/file\/d\/([^/]+)/) ||
    limpio.match(/drive\.google\.com\/open\?id=([^&]+)/) ||
    limpio.match(/drive\.google\.com\/uc\?.*[?&]id=([^&]+)/);
  if (drive) {
    return `https://drive.google.com/uc?export=view&id=${drive[1]}`;
  }

  if (limpio.includes("dropbox.com")) {
    return limpio
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace(/([?&])dl=0/, "$1raw=1");
  }

  return limpio;
}

// Los enlaces de un lugar (video, menú, mapa, galería...) los escribe un negocio. Un texto como
// "javascript:alert(1)" es una URL válida para el navegador y, puesto en un href, se ejecuta al hacer
// clic. El backend ya lo rechaza al guardar; esto es la segunda barrera por si llegara un dato viejo o
// manipulado: solo se enlaza lo que empieza con http:// o https://.
export function urlHttpSegura(url) {
  if (typeof url !== "string") return null;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

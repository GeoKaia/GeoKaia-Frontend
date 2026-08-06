// Paleta extendida en armonía con la de marca oficial (terracota/teal/marrón), para darle
// un color distinto a cada subcategoria sin quedar atados a los 4 colores de acento del logo.
// Exportada porque también se usa como opciones del selector de color de una Ruta — estos
// 10 tonos ya están pensados para contrastar bien con texto blanco.
export const PALETA_EXTENDIDA = [
  '#AC6727', // terracota (primario)
  '#10546F', // teal oscuro (acento)
  '#2989A3', // teal claro
  '#6B8548', // verde selva
  '#9C4A3C', // rojo volcánico
  '#3A2B1D', // marrón (texto)
  '#C89B3C', // mostaza
  '#4F7A72', // verde agua / laguna
  '#7D5A73', // ciruela
  '#BCB1A1', // gris cálido
];

function hashTexto(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Mismo texto de subcategoria -> siempre el mismo color (estable entre recargas).
export function colorSubcategoria(subcategoria) {
  if (!subcategoria) return null;
  return PALETA_EXTENDIDA[hashTexto(subcategoria) % PALETA_EXTENDIDA.length];
}

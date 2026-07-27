// Paleta extendida en armonía con la de marca (terracota/dorado/teal), para darle
// un color distinto a cada subcategoria sin quedar atados a los 4 colores de Diana.
const PALETA_EXTENDIDA = [
  '#B8722E', // terracota (primario)
  '#1B5A6B', // teal (acento)
  '#D9A15B', // dorado (secundario)
  '#6B8E4E', // verde selva
  '#A6443C', // rojo volcánico
  '#0F3D4A', // teal oscuro
  '#C9A227', // mostaza
  '#4A7C82', // verde agua / laguna
  '#8B5E83', // ciruela
  '#7A5C3E', // tierra
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

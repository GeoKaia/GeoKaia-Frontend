// Estado global de las pantallas de carga.
// Es un store simple (no un contexto de React) para que código que vive fuera de
// los componentes, como el Proxy de conLoader.js, pueda mostrar y ocultar el loader.

// Cuántas cargas activas pidieron cada variante.
// "aleatorio" significa que no les importa cuál se vea: se sortea entre volcán y lago.
const cuentas = { lago: 0, volcan: 0, aleatorio: 0 };
const oyentes = new Set();

// Valor estable para el render en el servidor (useSyncExternalStore lo necesita).
export const LOADER_SERVIDOR = { visible: false, variante: "lago" };

let instantanea = LOADER_SERVIDOR;
let eleccionAzar = "lago";

function actualizar() {
  const visible = cuentas.lago + cuentas.volcan + cuentas.aleatorio > 0;

  // Al aparecer el loader se sortea cuál mostrar; la elección se mantiene mientras siga visible.
  if (visible && !instantanea.visible) {
    eleccionAzar = Math.random() < 0.5 ? "volcan" : "lago";
  }

  // Si alguna carga exige una variante concreta, esa manda (el volcán gana sobre el lago).
  const variante = cuentas.volcan > 0 ? "volcan" : cuentas.lago > 0 ? "lago" : eleccionAzar;

  if (instantanea.visible === visible && instantanea.variante === variante) return;
  instantanea = { visible, variante };
  oyentes.forEach((avisar) => avisar());
}

function normalizar(variante) {
  return variante === "volcan" || variante === "lago" ? variante : "aleatorio";
}

/** Suma una carga activa. Mientras haya al menos una, el loader se ve. */
export function mostrarLoader(variante = "aleatorio") {
  cuentas[normalizar(variante)] += 1;
  actualizar();
}

/** Resta una carga activa. Cuando no queda ninguna, el loader se oculta. */
export function ocultarLoader(variante = "aleatorio") {
  const clave = normalizar(variante);
  cuentas[clave] = Math.max(0, cuentas[clave] - 1);
  actualizar();
}

export function suscribirLoader(avisar) {
  oyentes.add(avisar);
  return () => oyentes.delete(avisar);
}

export function leerLoader() {
  return instantanea;
}
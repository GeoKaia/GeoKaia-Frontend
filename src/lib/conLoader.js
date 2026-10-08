import { mostrarLoader, ocultarLoader } from "./loaderStore";

const OPCIONES_BASE = {
  variante: "aleatorio", // "aleatorio" (sortea) | "lago" | "volcan"
  retraso: 200, // ms que debe tardar la carga antes de mostrar el loader (evita parpadeos)
  minimo: 400, // ms mínimos que se queda visible una vez que apareció
};

async function ejecutar(funcion, contexto, argumentos, opciones) {
  // En el servidor no hay pantalla que mostrar (y el estado se compartiría entre usuarios).
  if (typeof window === "undefined") {
    return funcion.apply(contexto, argumentos);
  }

  const { variante, retraso, minimo } = opciones;
  let mostradoEn = 0;

  const temporizador = setTimeout(() => {
    mostradoEn = Date.now();
    mostrarLoader(variante);
  }, retraso);

  try {
    return await funcion.apply(contexto, argumentos);
  } finally {
    clearTimeout(temporizador);
    if (mostradoEn) {
      // El resultado se entrega de inmediato; solo se retrasa el ocultar el loader.
      const restante = minimo - (Date.now() - mostradoEn);
      if (restante > 0) setTimeout(() => ocultarLoader(variante), restante);
      else ocultarLoader(variante);
    }
  }
}

/**
 * Patrón Proxy: envuelve una función async, o un objeto con funciones async
 * (por ejemplo tu cliente de API), para mostrar el loader mientras tardan.
 * El resto de la app lo usa igual que el original.
 *
 *   const obtenerRutas = conLoader(obtenerRutasOriginal);
 *   const api = conLoader(apiOriginal, { variante: "volcan" });
 *
 * Nota: las funciones envueltas siempre devuelven una Promise.
 */
export function conLoader(objetivo, opciones = {}) {
  const config = { ...OPCIONES_BASE, ...opciones };

  if (typeof objetivo === "function") {
    return new Proxy(objetivo, {
      apply(funcion, contexto, argumentos) {
        return ejecutar(funcion, contexto, argumentos, config);
      },
    });
  }

  return new Proxy(objetivo, {
    get(destino, propiedad, receptor) {
      const valor = Reflect.get(destino, propiedad, receptor);
      if (typeof valor !== "function") return valor;
      return (...argumentos) => ejecutar(valor, destino, argumentos, config);
    },
  });
}
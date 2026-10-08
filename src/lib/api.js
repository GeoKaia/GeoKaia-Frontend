import { Utensils, Drama, Mountain, Landmark, Palette, BedDouble } from "lucide-react";

import { conLoader } from "./conLoader";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://geokaia-backend.onrender.com";

// La paleta oficial (con logo) solo trae 4 colores de acento para 5 categorías -> ARTESANIA reutiliza GASTRONOMIA.
// "Icono" es el componente de lucide-react, no un string: se renderiza como <cat.Icono />.
export const CATEGORIAS = {
  GASTRONOMIA: { label: "Gastronomía", color: "#AC6727", Icono: Utensils },
  CULTURA: { label: "Cultura", color: "#2989A3", Icono: Drama },
  NATURALEZA: { label: "Naturaleza", color: "#10546F", Icono: Mountain },
  HISTORIA: { label: "Historia", color: "#BCB1A1", Icono: Landmark },
  ARTESANIA: { label: "Artesanía", color: "#AC6727", Icono: Palette },
  ALOJAMIENTO: { label: "Alojamiento", color: "#2989A3", Icono: BedDouble },
};

// Error de la API con un mensaje pensado para mostrarse tal cual a la persona usuaria.
//  - tipo: "red" | "timeout" | "sesion" | "limite" | "servidor" | "validacion" | "otro"
//  - resultadoIncierto: true cuando era una escritura (guardar, borrar...) y NO sabemos si llegó a
//    completarse en el servidor (se cortó la conexión o no hubo respuesta a tiempo). La pantalla puede
//    usarlo para comprobar el estado real antes de pedirle a la persona que repita la acción.
export class ErrorApi extends Error {
  constructor(mensaje, { tipo = "otro", status = null, resultadoIncierto = false } = {}) {
    super(mensaje);
    this.name = "ErrorApi";
    this.tipo = tipo;
    this.status = status;
    this.resultadoIncierto = resultadoIncierto;
  }
}

// Render (plan gratuito) tarda hasta ~30-60 s en despertar tras un rato sin uso.
const TIMEOUT_MS = 50000;
const PAUSAS_REINTENTO_MS = [1500, 3500, 6000, 10000, 15000]; // ~36 s: lo que tarda Render en despertar
const REINTENTOS_SIN_RED = 2;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const MENSAJE_SIN_RED = "No pudimos conectarnos. Revisá tu conexión a internet e intentá de nuevo.";
const MENSAJE_SIN_RED_ESCRITURA =
  "Se cortó la conexión y no sabemos si se guardó. Revisá tu internet, comprobá si el cambio aparece y, si no, volvé a intentarlo.";
const MENSAJE_TIMEOUT = "El servidor está tardando en responder (puede estar despertando). Esperá unos segundos e intentá de nuevo.";
const MENSAJE_TIMEOUT_ESCRITURA =
  "El servidor tardó demasiado en responder y no sabemos si se guardó. Comprobá si el cambio aparece y, si no, volvé a intentarlo.";

// options.reintentable: la acción se puede repetir sin riesgo (login, consultar a Kaia...), así que un corte
// de conexión se explica como "volvé a intentar" y no como "quizás se guardó".
// options.mensajeIncierto: texto propio para una escritura de resultado incierto.
async function apiFetch(path, options = {}) {
  const { reintentable = false, mensajeIncierto, ...opcionesFetch } = options;
  const metodo = (opcionesFetch.method || "GET").toUpperCase();
  const esLectura = metodo === "GET";
  const inciertaSiSeCorta = !esLectura && !reintentable;

  // Sin internet no se manda nada: así sabemos con certeza que NO se guardó.
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new ErrorApi(
      esLectura || reintentable
        ? "Estás sin conexión a internet. Conectate e intentá de nuevo."
        : "Estás sin conexión a internet, así que no se guardó nada. Conectate y volvé a intentarlo.",
      { tipo: "red" }
    );
  }

  // Las lecturas se reintentan solas: un corte breve o el servidor despertando no deberían llegar a la pantalla.
  const intentos = esLectura ? PAUSAS_REINTENTO_MS.length + 1 : 1;
  let ultimo;

  for (let i = 0; i < intentos; i++) {
    if (i > 0) await esperar(PAUSAS_REINTENTO_MS[i - 1]);

    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);
    let res;
    try {
      res = await fetch(`${API_URL}${path}`, {
        ...opcionesFetch,
        signal: controlador.signal,
        headers: { "Content-Type": "application/json", ...opcionesFetch.headers },
      });
    } catch (err) {
      const agotado = err?.name === "AbortError";
      ultimo = new ErrorApi(
        inciertaSiSeCorta
          ? mensajeIncierto || (agotado ? MENSAJE_TIMEOUT_ESCRITURA : MENSAJE_SIN_RED_ESCRITURA)
          : agotado
            ? MENSAJE_TIMEOUT
            : MENSAJE_SIN_RED,
        { tipo: agotado ? "timeout" : "red", resultadoIncierto: inciertaSiSeCorta }
      );
      // Un timeout ya esperó casi un minuto: no se repite solo. Un corte de red sí.
      if (agotado || i >= REINTENTOS_SIN_RED) break;
      continue;
    } finally {
      clearTimeout(temporizador);
    }

    // Puede no ser JSON: un proxy o el hosting dormido responden HTML con un 502/503/504.
    const data = await res.json().catch(() => ({}));

    if (res.ok) return data;

    // El servidor está despertando o saturado: en lecturas se reintenta solo.
    if ([502, 503, 504].includes(res.status)) {
      ultimo = new ErrorApi(
        inciertaSiSeCorta && res.status !== 503
          ? mensajeIncierto || "El servidor no respondió a tiempo y no sabemos si se guardó. Comprobá si el cambio aparece y, si no, volvé a intentarlo."
          : "El servidor se está iniciando o está ocupado. Esperá unos segundos e intentá de nuevo.",
        { tipo: "servidor", status: res.status, resultadoIncierto: inciertaSiSeCorta && res.status !== 503 }
      );
      continue;
    }

    throw errorDeRespuesta(res.status, data, opcionesFetch.headers);
  }

  throw ultimo;
}

// Traduce una respuesta de error del backend a un mensaje claro.
function errorDeRespuesta(status, data, headers = {}) {
  const textoServidor = typeof data?.error === "string" ? data.error : null;

  // El middleware de validación del backend manda el motivo real por campo en "detalles"
  // (ej. "La URL no parece ser una foto real...") — sin esto, cualquier error de validación se
  // veía como el genérico "Error de validación" y el negocio no sabía qué corregir.
  if (data?.detalles?.length) {
    return new ErrorApi(data.detalles.map((d) => d.mensaje).join(" "), { tipo: "validacion", status });
  }

  // Con un token en la petición, 401/403 significa sesión vencida o inválida (no credenciales mal escritas).
  const llevaToken = Boolean(headers?.Authorization);
  if (llevaToken && (status === 401 || status === 403) && /token/i.test(textoServidor || "")) {
    return new ErrorApi("Tu sesión venció. Iniciá sesión de nuevo para continuar.", { tipo: "sesion", status });
  }

  if (status === 429) {
    return new ErrorApi(textoServidor || "Hiciste muchos intentos seguidos. Esperá unos minutos e intentá de nuevo.", { tipo: "limite", status });
  }
  if (status === 413) {
    return new ErrorApi("Lo que intentás enviar es demasiado grande. Acortá el texto e intentá de nuevo.", { tipo: "validacion", status });
  }
  if (status >= 500) {
    // Los 500 del backend traen un texto corto y técnico ("Error al crear el lugar"): se completa con qué hacer.
    const motivo = (textoServidor || "Tuvimos un problema de nuestro lado").replace(/[.\s]+$/, "");
    return new ErrorApi(`${motivo}. Intentá de nuevo en unos minutos.`, { tipo: "servidor", status });
  }

  return new ErrorApi(textoServidor || "Ocurrió un error inesperado. Intentá de nuevo.", { tipo: "otro", status });
}

// --- Mapa / lugares (público) ---

// Las lecturas que llenan una pantalla (mapa, listas, paneles) muestran el lago si tardan, y pasan al volcán
// ("Despertando el servidor") si pasan de ~4 s. Las escrituras no: cada formulario ya muestra su propio estado.
const CON_LOADER = { variante: "lago", escalarA: "volcan", escalarTras: 4000 };

function obtenerLugaresBase() {
  return apiFetch("/api/lugares", { cache: "no-store" });
}
export const obtenerLugares = conLoader(obtenerLugaresBase, CON_LOADER);

// --- Rutas (público) ---

function obtenerRutasBase() {
  return apiFetch("/api/rutas", { cache: "no-store" });
}
export const obtenerRutas = conLoader(obtenerRutasBase, CON_LOADER);

// --- Rutas [Admin] (requiere JWT de una cuenta con esAdmin) ---

export function crearRuta(token, datos) {
  return apiFetch("/api/rutas", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
}

export function actualizarRuta(token, id, datos) {
  return apiFetch(`/api/rutas/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
}

export function eliminarRuta(token, id) {
  return apiFetch(`/api/rutas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- IA / chat de Kaia (público) ---

export function recomendarRuta(consulta) {
  return apiFetch("/api/ia/recomendar-ruta", {
    method: "POST",
    reintentable: true,
    body: JSON.stringify({ consulta }),
  });
}

// --- Panel de negocio (requiere JWT) ---

function obtenerMiLugarBase(token) {
  return apiFetch("/api/lugares/mi-lugar", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
}
export const obtenerMiLugar = conLoader(obtenerMiLugarBase, CON_LOADER);

export function actualizarMiLugar(token, cambios) {
  return apiFetch("/api/lugares/mi-lugar", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(cambios),
  });
}

export function crearLugar(token, datos) {
  return apiFetch("/api/lugares", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
}

export function eliminarMiLugar(token, password) {
  return apiFetch("/api/lugares/mi-lugar", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ password }),
  });
}

// --- Admin (requiere JWT de una cuenta con esAdmin) ---

function obtenerLugaresPendientesBase(token) {
  return apiFetch("/api/lugares/admin/pendientes", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
}
export const obtenerLugaresPendientes = conLoader(obtenerLugaresPendientesBase, CON_LOADER);

export function actualizarEstadoLugar(token, id, estado) {
  return apiFetch(`/api/lugares/admin/${id}/estado`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ estado }),
  });
}

// Acceso amplio de admin a TODOS los lugares (cualquier negocio, cualquier estado) —
// pedido puntual para acelerar la carga de contenido antes de la entrega final.
function obtenerTodosLosLugaresBase(token) {
  return apiFetch("/api/lugares/admin/todos", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
}
export const obtenerTodosLosLugares = conLoader(obtenerTodosLosLugaresBase, CON_LOADER);

export function actualizarLugarAdmin(token, id, cambios) {
  return apiFetch(`/api/lugares/admin/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(cambios),
  });
}

export function eliminarLugarAdmin(token, id) {
  return apiFetch(`/api/lugares/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Auth de negocio (público) ---

export function registrarNegocio({ email, password, nombreContacto, whatsapp, aceptaTerminos }) {
  return apiFetch("/api/auth/registrar", {
    method: "POST",
    mensajeIncierto:
      "Se cortó la conexión y no sabemos si tu cuenta se creó. Probá iniciar sesión con tu correo y contraseña; si el correo ya existe pero no llegaste a ver el código QR, escribinos a geokaia404@gmail.com.",
    body: JSON.stringify({ email, password, nombreContacto, whatsapp, aceptaTerminos }),
  });
}

export function loginNegocio({ email, password }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    reintentable: true,
    body: JSON.stringify({ email, password }),
  });
}

export function verificar2FA({ negocioId, token }) {
  return apiFetch("/api/auth/verificar-2fa", {
    method: "POST",
    reintentable: true,
    body: JSON.stringify({ negocioId, token }),
  });
}

export function eliminarCuenta(token, password) {
  return apiFetch("/api/auth/cuenta", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ password }),
  });
}

// --- Leads (público) ---

export function crearLead({ nombreNegocio, nombreContacto, whatsapp, mensaje }) {
  return apiFetch("/api/leads", {
    method: "POST",
    body: JSON.stringify({ nombreNegocio, nombreContacto, whatsapp, mensaje }),
  });
}

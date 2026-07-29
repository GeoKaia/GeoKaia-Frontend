export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://geokaia-backend.onrender.com";

// La paleta oficial (con logo) solo trae 4 colores de acento para 5 categorías -> ARTESANIA reutiliza GASTRONOMIA.
export const CATEGORIAS = {
  GASTRONOMIA: { label: "Gastronomía", color: "#AC6727", emoji: "🍽️" },
  CULTURA: { label: "Cultura", color: "#2989A3", emoji: "🎭" },
  NATURALEZA: { label: "Naturaleza", color: "#10546F", emoji: "🌋" },
  HISTORIA: { label: "Historia", color: "#BCB1A1", emoji: "🏛️" },
  ARTESANIA: { label: "Artesanía", color: "#AC6727", emoji: "🧺" },
};

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ocurrió un error inesperado. Intentá de nuevo.");
  }

  return data;
}

// --- Mapa / lugares (público) ---

export function obtenerLugares() {
  return apiFetch("/api/lugares", { cache: "no-store" });
}

// --- Rutas (público) ---

export function obtenerRutas() {
  return apiFetch("/api/rutas", { cache: "no-store" });
}

// --- IA / chat de Kaia (público) ---

export function recomendarRuta(consulta) {
  return apiFetch("/api/ia/recomendar-ruta", {
    method: "POST",
    body: JSON.stringify({ consulta }),
  });
}

// --- Panel de negocio (requiere JWT) ---

export function obtenerMiLugar(token) {
  return apiFetch("/api/lugares/mi-lugar", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
}

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

// --- Admin (requiere JWT de una cuenta con esAdmin) ---

export function obtenerLugaresPendientes(token) {
  return apiFetch("/api/lugares/admin/pendientes", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function actualizarEstadoLugar(token, id, estado) {
  return apiFetch(`/api/lugares/admin/${id}/estado`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ estado }),
  });
}

// --- Auth de negocio (público) ---

export function registrarNegocio({ email, password, nombreContacto, whatsapp }) {
  return apiFetch("/api/auth/registrar", {
    method: "POST",
    body: JSON.stringify({ email, password, nombreContacto, whatsapp }),
  });
}

export function loginNegocio({ email, password }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function verificar2FA({ negocioId, token }) {
  return apiFetch("/api/auth/verificar-2fa", {
    method: "POST",
    body: JSON.stringify({ negocioId, token }),
  });
}

// --- Leads (público) ---

export function crearLead({ nombreNegocio, nombreContacto, whatsapp, mensaje }) {
  return apiFetch("/api/leads", {
    method: "POST",
    body: JSON.stringify({ nombreNegocio, nombreContacto, whatsapp, mensaje }),
  });
}

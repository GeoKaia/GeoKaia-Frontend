export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://geokaia-backend.onrender.com";

// La paleta de Diana solo trae 4 colores para 5 categorías -> ARTESANIA reutiliza el secundario.
export const CATEGORIAS = {
  GASTRONOMIA: { label: "Gastronomía", color: "#B8722E", emoji: "🍽️" },
  CULTURA: { label: "Cultura", color: "#1B5A6B", emoji: "🎭" },
  NATURALEZA: { label: "Naturaleza", color: "#0F3D4A", emoji: "🌋" },
  HISTORIA: { label: "Historia", color: "#D9A15B", emoji: "🏛️" },
  ARTESANIA: { label: "Artesanía", color: "#D9A15B", emoji: "🧺" },
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

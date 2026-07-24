const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ocurrió un error inesperado. Intentá de nuevo.");
  }

  return data;
}

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

export function crearLead({ nombreNegocio, nombreContacto, whatsapp, mensaje }) {
  return apiFetch("/api/leads", {
    method: "POST",
    body: JSON.stringify({ nombreNegocio, nombreContacto, whatsapp, mensaje }),
  });
}

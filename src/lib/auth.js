const TOKEN_KEY = "geokaia_token";

export function guardarToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function obtenerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function borrarToken() {
  localStorage.removeItem(TOKEN_KEY);
}

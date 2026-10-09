// La sesión ya NO vive en el navegador: el backend la deja en una cookie httpOnly (gk_sesion) que JavaScript no puede
// leer ni copiar. Para saber si hay sesión y quién es, se usa obtenerSesion() de "@/lib/api" (GET /api/auth/me).
//
// Lo único que queda acá es limpiar el token que versiones anteriores guardaban en localStorage, para que no
// quede una credencial vieja a la vista en F12 > Application.
const TOKEN_ANTIGUO = "geokaia_token";

export function limpiarTokenAntiguo() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_ANTIGUO);
    window.sessionStorage.removeItem(TOKEN_ANTIGUO);
  } catch {
    // Almacenamiento bloqueado (modo privado): no hay nada que limpiar.
  }
}

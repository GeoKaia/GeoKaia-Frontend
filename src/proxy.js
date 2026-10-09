import { NextResponse } from "next/server";

// Guardia en el SERVIDOR para /admin y /panel-negocio. Antes la protección era solo del lado del navegador: quien
// escribía /admin en la barra de direcciones recibía igual el armazón de la página de administración (títulos,
// enlaces a otras secciones). Ahora la petición se corta acá, antes de enviar nada de la página:
//  - sin cookie de sesión, o con una que el backend no acepta  -> al login que corresponde;
//  - sesión válida pero sin permisos de admin intentando /admin  -> al inicio (sin confirmar que /admin existe).
// La seguridad real sigue estando en la API (authMiddleware y adminMiddleware): esto evita mostrar la interfaz.
const BACKEND_URL = (process.env.BACKEND_URL || "https://geokaia-backend.onrender.com").replace(/\/$/, "");
const COOKIE = "gk_sesion";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const esRutaAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const login = new URL(esRutaAdmin ? "/admin/login" : "/negocio/login", request.url);

  if (!request.cookies.has(COOKIE)) return NextResponse.redirect(login);

  try {
    // Render (plan gratuito) puede tardar en despertar: se espera, pero no indefinidamente.
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { cookie: request.headers.get("cookie") || "" },
      cache: "no-store",
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) return NextResponse.redirect(login);

    const sesion = await res.json();
    if (esRutaAdmin && !sesion.esAdmin) return NextResponse.redirect(new URL("/", request.url));
  } catch {
    return NextResponse.redirect(login);
  }

  const respuesta = NextResponse.next();
  // Páginas con sesión: que ningún proxy ni el botón "atrás" las guarde en caché.
  respuesta.headers.set("Cache-Control", "private, no-store");
  return respuesta;
}

export const config = {
  matcher: ["/admin/:path*", "/panel-negocio/:path*"],
};

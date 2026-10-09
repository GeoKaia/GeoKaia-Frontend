"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { obtenerSesion } from "@/lib/api";

// Guardia de TODAS las pantallas de /admin. Pregunta al servidor quién es la persona (GET /api/auth/me) y no se fía de
// nada guardado en el navegador:
//  - sin sesión válida  -> se redirige al inicio de sesión de administración;
//  - con sesión pero sin rol de administrador -> se niega el acceso (no se muestra nada de la interfaz de admin);
//  - administrador -> se muestra la pantalla.
// Mientras el servidor responde no se pinta la interfaz de administración. Esta guardia solo evita mostrar pantallas
// que no corresponden: la seguridad real está en la API, que verifica sesión y rol en cada petición.
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [estado, setEstado] = useState("verificando"); // verificando | admin | sin-permiso | error
  const esLogin = pathname === "/admin/login";

  useEffect(() => {
    if (esLogin) return;
    let vigente = true;
    obtenerSesion()
      .then((sesion) => {
        if (!vigente) return;
        if (!sesion) {
          router.replace("/admin/login");
        } else {
          setEstado(sesion.esAdmin ? "admin" : "sin-permiso");
        }
      })
      .catch(() => vigente && setEstado("error"));
    return () => {
      vigente = false;
    };
  }, [esLogin, pathname, router]);

  if (esLogin) return children;

  if (estado === "admin") return children;

  return (
    <main id="contenido" className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      {estado === "verificando" && <p className="text-brand-text/70 animate-pulse">Verificando acceso...</p>}
      {estado === "sin-permiso" && (
        <>
          <ShieldAlert size={32} className="text-red-700" aria-hidden="true" />
          <h1 className="text-xl font-bold text-brand-text">Acceso denegado</h1>
          <p className="max-w-sm text-sm text-brand-text/70">Tu cuenta no tiene permisos de administrador para ver esta sección.</p>
          <Link href="/" className="text-sm text-accent-fg underline">
            Volver al inicio
          </Link>
        </>
      )}
      {estado === "error" && (
        <>
          <p className="text-sm text-red-700">No pudimos verificar tu acceso. Revisá tu conexión e intentá de nuevo.</p>
          <button onClick={() => router.refresh()} className="rounded-lg bg-accent-dark text-white font-semibold px-4 py-2">
            Reintentar
          </button>
        </>
      )}
    </main>
  );
}

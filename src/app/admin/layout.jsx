"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { verificarAccesoAdmin } from "@/lib/api";
import { obtenerToken, borrarToken } from "@/lib/auth";

// Guardia de todo /admin. Escribir la dirección a mano no muestra nada del panel hasta que el servidor confirma
// que la cuenta es admin: sin sesión se redirige al login, y con una sesión sin permisos se niega el acceso.
// (La seguridad real sigue en el backend: cada ruta /admin de la API exige el rol en cada petición.)
export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const esLogin = pathname === "/admin/login";
  const [estado, setEstado] = useState("verificando"); // verificando | permitido | denegado

  useEffect(() => {
    if (esLogin) return;
    let activo = true;
    const token = obtenerToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    verificarAccesoAdmin(token)
      .then(() => activo && setEstado("permitido"))
      .catch((err) => {
        if (!activo) return;
        if (err.tipo === "sesion") {
          borrarToken();
          router.replace("/admin/login");
        } else if (err.status === 403 || err.status === 401) {
          setEstado("denegado");
        } else {
          // Sin conexión o servidor caído: no se abre el panel; el servidor igual rechazaría cualquier acción.
          setEstado("denegado");
        }
      });
    return () => {
      activo = false;
    };
  }, [esLogin, pathname, router]);

  if (esLogin) return children;
  if (estado === "permitido") return children;

  if (estado === "denegado") {
    return (
      <main id="contenido" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-bg px-4 text-center">
        <h1 className="text-xl font-bold text-brand-text">Acceso denegado</h1>
        <p className="max-w-sm text-sm text-brand-text/70">Esta área es solo para administradores de GeoKaia.</p>
        <Link href="/" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
          Volver al inicio
        </Link>
      </main>
    );
  }

  // Verificando (o redirigiendo): no se dibuja nada del panel.
  return <div className="min-h-screen bg-brand-bg" aria-busy="true" />;
}

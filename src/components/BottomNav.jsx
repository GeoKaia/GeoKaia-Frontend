"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { obtenerToken } from "@/lib/auth";

const ICONOS = {
  inicio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  rutas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 20l-5-2V6l5 2m0 12l6-2m-6 2V8m6 10l5 2V8l-5-2m0 12V6m0 0L9 8" />
    </svg>
  ),
  destacados: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5 1.2-7-5-5 7-1z" />
    </svg>
  ),
  negocio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  ajustes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

export default function BottomNav() {
  const pathname = usePathname();
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    setLogueado(!!obtenerToken());
  }, [pathname]);

  const items = [
    { key: "inicio", label: "Inicio", href: "/" },
    { key: "rutas", label: "Rutas", href: "/rutas" },
    { key: "destacados", label: "Destacados", href: "/destacados" },
    { key: "negocio", label: logueado ? "Mi negocio" : "Ingreso", href: logueado ? "/panel-negocio" : "/negocio/login" },
    { key: "ajustes", label: "Ajustes", href: "/ajustes" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-[1000] bg-white border-t border-secondary/30 flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const activo = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors"
            style={{ color: activo ? "var(--color-accent-dark)" : "#9C9187" }}
          >
            {ICONOS[item.key]}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

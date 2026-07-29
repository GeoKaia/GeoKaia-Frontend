"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { obtenerToken } from "@/lib/auth";

export default function Header() {
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    setLogueado(!!obtenerToken());
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-secondary/30">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/geokaia-logo.png"
          alt="GeoKaia"
          width={36}
          height={36}
          className="rounded-full"
          priority
        />
        <span className="font-bold text-lg text-brand-text">GeoKaia</span>
      </Link>

      <div className="flex items-center gap-3">
        {logueado && (
          <Link
            href="/admin"
            aria-label="Panel de administración"
            title="Panel de administración"
            className="w-9 h-9 rounded-full border border-accent-dark text-accent-dark flex items-center justify-center hover:bg-accent-dark hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </Link>
        )}
        <Link
          href={logueado ? "/panel-negocio" : "/negocio/login"}
          aria-label={logueado ? "Mi panel de negocio" : "Ingreso de negocios"}
          title={logueado ? "Mi panel de negocio" : "Ingreso de negocios"}
          className="w-9 h-9 rounded-full border border-accent-dark text-accent-dark flex items-center justify-center hover:bg-accent-dark hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </Link>
        <Link
          href="/ajustes"
          aria-label="Ajustes"
          title="Ajustes"
          className="w-9 h-9 rounded-full border border-accent-dark text-accent-dark flex items-center justify-center hover:bg-accent-dark hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

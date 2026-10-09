"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { normalizarUrlImagen } from "@/lib/imagenes";
import ImagenRemota from "./ImagenRemota";

export default function RouteCard({ ruta }) {
  const [fotoError, setFotoError] = useState(false);
  const color = ruta.color || "#10546F";
  const emoji = ruta.emoji || "🗺️";

  return (
    <Link
      href={`/rutas/${ruta.id}`}
      className="block bg-surface border border-secondary/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {ruta.fotoUrl && !fotoError && (
        <div className="relative h-32 w-full">
          <ImagenRemota
            src={normalizarUrlImagen(ruta.fotoUrl)}
            alt={ruta.nombre}
            sizes="(max-width: 640px) 100vw, 33vw"
            onError={() => setFotoError(true)}
          />
        </div>
      )}

      <div className="p-4">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 text-white"
          style={{ backgroundColor: color }}
        >
          {emoji} {ruta.categoria}
        </span>

        <h3 className="font-bold text-base text-brand-text leading-tight">{ruta.nombre}</h3>
        <p className="text-sm text-brand-text/70 mt-1 line-clamp-3">{ruta.descripcion}</p>

        <p className="flex items-center gap-1 text-xs text-brand-text/70 mt-2">
          <MapPin size={12} /> {ruta.paradas.length} {ruta.paradas.length === 1 ? "parada" : "paradas"}
        </p>
      </div>
    </Link>
  );
}

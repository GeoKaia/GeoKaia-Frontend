import Link from "next/link";
import { CATEGORIAS } from "@/lib/api";

export default function RouteCard({ ruta }) {
  const cat = CATEGORIAS[ruta.categoria?.toUpperCase()] || { label: ruta.categoria, color: "#10546F", emoji: "🗺️" };

  return (
    <Link
      href={`/rutas/${ruta.id}`}
      className="block bg-white border border-secondary/40 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 text-white"
        style={{ backgroundColor: cat.color }}
      >
        {cat.emoji} {cat.label}
      </span>

      <h3 className="font-bold text-base text-brand-text leading-tight">{ruta.nombre}</h3>
      <p className="text-sm text-brand-text/70 mt-1 line-clamp-3">{ruta.descripcion}</p>

      <p className="text-xs text-brand-text/50 mt-2">
        📍 {ruta.paradas.length} {ruta.paradas.length === 1 ? "parada" : "paradas"}
      </p>
    </Link>
  );
}

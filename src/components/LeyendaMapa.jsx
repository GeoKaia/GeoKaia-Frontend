'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { colorSubcategoria } from '@/lib/colores';

export default function LeyendaMapa({ lugares, seleccionada, onSeleccionar }) {
  // Colapsada por default: con tantas subcategorías (crecen a medida que se cargan
  // más lugares) la lista abierta tapaba casi todo el mapa, sobre todo en celular.
  const [abierta, setAbierta] = useState(false);

  const subcategorias = [...new Set(lugares.map((l) => l.subcategoria).filter(Boolean))]
    .sort()
    .map((sub) => ({ sub, color: colorSubcategoria(sub) }));

  if (subcategorias.length === 0) return null;

  return (
    <div className="absolute z-[1000] bottom-3 left-3 bg-white rounded-lg shadow-md max-w-[220px] overflow-hidden">
      <button
        onClick={() => setAbierta((v) => !v)}
        className="w-full flex items-center justify-between gap-2 text-xs font-semibold text-brand-text px-3 py-2"
        aria-expanded={abierta}
      >
        Explorá por tipo
        {abierta ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {abierta && (
        <div className="flex flex-col gap-1.5 max-h-[45vh] overflow-y-auto px-3 pb-3">
          {subcategorias.map(({ sub, color }) => {
            const activa = seleccionada === sub;
            return (
              <button
                key={sub}
                onClick={() => onSeleccionar(activa ? null : sub)}
                className="flex items-center gap-2 text-xs px-2 py-1 rounded transition-colors text-left shrink-0"
                style={{
                  backgroundColor: activa ? color : `${color}22`,
                  color: activa ? '#ffffff' : '#2B2B2B',
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {sub}
              </button>
            );
          })}
          {seleccionada && (
            <button
              onClick={() => onSeleccionar(null)}
              className="text-[11px] text-gray-400 underline mt-1 text-left shrink-0"
            >
              Ver todos
            </button>
          )}
        </div>
      )}
    </div>
  );
}

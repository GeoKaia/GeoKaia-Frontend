'use client';

import { colorSubcategoria } from '@/lib/colores';

export default function LeyendaMapa({ lugares, seleccionada, onSeleccionar }) {
  const subcategorias = [...new Set(lugares.map((l) => l.subcategoria).filter(Boolean))]
    .sort()
    .map((sub) => ({ sub, color: colorSubcategoria(sub) }));

  if (subcategorias.length === 0) return null;

  return (
    <div className="absolute z-[1000] bottom-3 left-3 bg-white rounded-lg shadow-md p-3 max-w-[220px]">
      <p className="text-xs font-semibold text-brand-text mb-2">Explorá por tipo</p>
      <div className="flex flex-col gap-1.5">
        {subcategorias.map(({ sub, color }) => {
          const activa = seleccionada === sub;
          return (
            <button
              key={sub}
              onClick={() => onSeleccionar(activa ? null : sub)}
              className="flex items-center gap-2 text-xs px-2 py-1 rounded transition-colors text-left"
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
            className="text-[11px] text-gray-400 underline mt-1 text-left"
          >
            Ver todos
          </button>
        )}
      </div>
    </div>
  );
}

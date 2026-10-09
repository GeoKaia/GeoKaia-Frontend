// Tarjetas "fantasma" del tamaño de las reales mientras llegan los datos: reservan el espacio para que el pie de
// página no salte hacia abajo cuando aparece el contenido (eso se mide como desplazamiento de diseño, CLS).
// Con prefers-reduced-motion se quedan quietas.
export default function EsqueletoTarjetas({ cantidad = 6, alto = "h-72" }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" aria-hidden="true">
      {Array.from({ length: cantidad }, (_, i) => (
        <div
          key={i}
          className={`${alto} animate-pulse rounded-xl border border-secondary/40 bg-surface p-3 shadow-sm motion-reduce:animate-none`}
        >
          <div className="h-32 rounded-lg bg-secondary/30" />
          <div className="mt-3 h-4 w-3/4 rounded bg-secondary/30" />
          <div className="mt-2 h-3 w-full rounded bg-secondary/20" />
          <div className="mt-1.5 h-3 w-5/6 rounded bg-secondary/20" />
        </div>
      ))}
    </div>
  );
}

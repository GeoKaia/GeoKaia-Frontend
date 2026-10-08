import Image from "next/image";
import {
  MapPin,
  Mountain,
  Navigation,
  Clock,
  Landmark,
  Store,
  Check,
  Star,
  Route,
  Sparkles,
} from "lucide-react";

// Ilustraciones de cada slide del carrusel. Son decorativas (aria-hidden): el mensaje real
// está en el título y el texto de cada slide. Cada una es un "plato" circular de color de
// marca con chips flotantes alrededor, como en el onboarding de VYGO pero con la paleta de
// GeoKaia (teal, terracota, arena).

function Chip({ className, Icono, titulo, detalle }) {
  return (
    <div className={`ob-chip ${className}`}>
      <span className="ob-chip-dot">
        <Icono size={18} strokeWidth={2.2} />
      </span>
      <div>
        {titulo}
        {detalle && <small>{detalle}</small>}
      </div>
    </div>
  );
}

function Pin({ className, color, children }) {
  return (
    <span className={`ob-pin ${className}`} style={{ "--c": color }}>
      <span className="ob-pin-icono">{children}</span>
    </span>
  );
}

// 1. Mapa: mini mapa estilizado con pines que "caen" (colores reales de las categorías).
export function ArteMapa() {
  return (
    <div className="ob-art" aria-hidden="true">
      <span className="ob-anillo ob-anillo-a" />
      <div className="ob-plato ob-plato-teal">
        <svg className="ob-minimapa" viewBox="0 0 220 220" focusable="false">
          {/* lago */}
          <path
            d="M-10 70 C 30 40, 70 60, 90 95 S 70 150, 30 160 S -10 140, -10 70 Z"
            fill="rgba(255,255,255,.28)"
          />
          <path d="M150 -10 C 175 30, 215 40, 235 30 L 235 -10 Z" fill="rgba(255,255,255,.22)" />
          {/* calles y límites */}
          <g fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="5" strokeLinecap="round">
            <path d="M-10 190 L 230 110" />
            <path d="M110 -10 C 100 60, 140 120, 130 230" />
            <path d="M-10 120 H 230" strokeWidth="3" strokeDasharray="2 9" />
          </g>
        </svg>
        <Pin className="ob-pin-1" color="var(--color-primary)">
          <MapPin size={15} strokeWidth={2.4} />
        </Pin>
        <Pin className="ob-pin-2" color="var(--color-accent-dark)">
          <Mountain size={15} strokeWidth={2.4} />
        </Pin>
        <Pin className="ob-pin-3" color="var(--color-secondary)">
          <Landmark size={15} strokeWidth={2.4} />
        </Pin>
      </div>
      <Chip className="ob-chip-a" Icono={Mountain} titulo="Volcanes y lagunas" detalle="Naturaleza" />
      <Chip className="ob-chip-b" Icono={Navigation} titulo="Cómo llegar" detalle="Waze y Google Maps" />
    </div>
  );
}

// 2. Rutas: recorrido punteado con 3 paradas y un pin que lo camina.
export function ArteRutas() {
  return (
    <div className="ob-art" aria-hidden="true">
      <span className="ob-anillo ob-anillo-b" />
      <div className="ob-plato ob-plato-terracota">
        <svg className="ob-minimapa" viewBox="0 0 220 220" focusable="false">
          <g fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="14" strokeLinecap="round">
            <path d="M-10 60 H 230" />
            <path d="M-10 160 H 230" />
            <path d="M60 -10 V 230" />
            <path d="M170 -10 V 230" />
          </g>
          <path
            d="M 40 170 C 70 120, 70 100, 110 100 S 160 70, 184 44"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          {[
            [40, 170, "1"],
            [110, 100, "2"],
            [184, 44, "3"],
          ].map(([x, y, n]) => (
            <g key={n}>
              <circle cx={x} cy={y} r="13" fill="#fff" />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--color-primary)">
                {n}
              </text>
            </g>
          ))}
        </svg>
        <span className="ob-caminante">
          <MapPin size={20} strokeWidth={2.4} />
        </span>
      </div>
      <Chip className="ob-chip-a" Icono={Landmark} titulo="Ruta colonial" detalle="Curada por el equipo" />
      <Chip className="ob-chip-b" Icono={Clock} titulo="3 paradas" detalle="25 min entre lugares" />
    </div>
  );
}

// 3. Kaia: la mascota con la burbuja de pregunta, la respuesta del usuario y puntos de "escribiendo".
export function ArteKaia() {
  return (
    <div className="ob-art" aria-hidden="true">
      <span className="ob-anillo ob-anillo-a" />
      <div className="ob-plato ob-plato-claro">
        <Image
          className="ob-mascota"
          src="/icons/kaia-mascota.png"
          alt=""
          width={320}
          height={226}
          sizes="180px"
        />
      </div>
      <div className="ob-burbuja ob-burbuja-kaia">¿Qué clase de recorrido querés disfrutar?</div>
      <div className="ob-burbuja ob-burbuja-yo">Volcanes y buena comida</div>
      <div className="ob-burbuja ob-burbuja-escribe">
        <span className="ob-punto" />
        <span className="ob-punto" />
        <span className="ob-punto" />
      </div>
      <span className="ob-destello">
        <Sparkles size={20} strokeWidth={2.2} />
      </span>
    </div>
  );
}

// 4. Negocios: la fachada de tienda con los planes como chips.
export function ArteNegocio() {
  return (
    <div className="ob-art" aria-hidden="true">
      <span className="ob-anillo ob-anillo-b" />
      <div className="ob-plato ob-plato-arena">
        <span className="ob-tienda">
          <Store size={92} strokeWidth={1.6} />
        </span>
        <Pin className="ob-pin-1 ob-pin-tienda" color="var(--color-primary)">
          <MapPin size={15} strokeWidth={2.4} />
        </Pin>
      </div>
      <Chip className="ob-chip-a" Icono={Check} titulo="Gratis" detalle="Tu pin y tus datos" />
      <Chip className="ob-chip-b" Icono={Star} titulo="Premium" detalle="360°, video y galería" />
      <span className="ob-destello ob-destello-b">
        <Route size={20} strokeWidth={2.2} />
      </span>
    </div>
  );
}

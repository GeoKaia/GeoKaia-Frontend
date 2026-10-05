import { Mountain, Waves, Droplet, MapPin, Sun, Compass, Flower2, Bird, TreePine } from "lucide-react";

// Los íconos del patrón del mockup de Figma (montaña, ola, gota, pin, sol, brújula, flor,
// pájaro, árbol), repetidos en una grilla escalonada a muy baja opacidad. Es puro adorno:
// aria-hidden y sin interacción.
const ICONOS = [Mountain, Waves, Droplet, MapPin, Sun, Compass, Flower2, Bird, TreePine];
const COLORES = ["var(--color-accent)", "var(--color-secondary)", "var(--color-primary)"];

export default function PatronMarca({ columnas = 6, filas = 11, className = "" }) {
  const celdas = Array.from({ length: columnas * filas }, (_, i) => {
    const fila = Math.floor(i / columnas);
    const col = i % columnas;
    // Desplazar las filas pares y alternar íconos/colores para que no se vea una cuadrícula rígida.
    const Icono = ICONOS[(i * 5 + fila * 2) % ICONOS.length];
    const color = COLORES[(col + fila) % COLORES.length];
    return { i, fila, Icono, color };
  });

  return (
    <div className={`ob-patron ${className}`} aria-hidden="true">
      <div className="ob-patron-grid" style={{ gridTemplateColumns: `repeat(${columnas}, 1fr)` }}>
        {celdas.map(({ i, fila, Icono, color }) => (
          <span key={i} className={fila % 2 ? "ob-patron-celda ob-patron-celda-baja" : "ob-patron-celda"}>
            <Icono size={26} strokeWidth={1.6} color={color} />
          </span>
        ))}
      </div>
    </div>
  );
}

import { Check, Circle } from "lucide-react";
import { REQUISITOS } from "@/lib/password";

// Lista en vivo de lo que ya cumple la contraseña que se está escribiendo.
export default function RequisitosContrasena({ password }) {
  const cumplidos = REQUISITOS.filter((r) => r.cumple(password)).length;

  return (
    <div className="mt-2" aria-live="polite">
      <div className="mb-1.5 flex gap-1" aria-hidden="true">
        {REQUISITOS.map((r, i) => (
          <span
            key={r.id}
            className={`h-1 flex-1 rounded-full ${i < cumplidos ? "bg-accent-dark" : "bg-secondary/40"}`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-0.5 text-xs sm:grid-cols-2">
        {REQUISITOS.map((r) => {
          const ok = r.cumple(password);
          return (
            <li key={r.id} className={`flex items-center gap-1.5 ${ok ? "text-accent-fg" : "text-brand-text/70"}`}>
              {ok ? <Check size={12} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
              <span>
                {r.texto}
                <span className="sr-only">{ok ? " (cumplido)" : " (pendiente)"}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

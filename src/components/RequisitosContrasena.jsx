import { REQUISITOS_CONTRASENA } from "@/lib/password";

// Lista de requisitos que se marcan en vivo mientras la persona escribe su contraseña.
export default function RequisitosContrasena({ password = "" }) {
  return (
    <ul className="mt-2 space-y-1 text-xs" aria-label="Requisitos de la contraseña">
      {REQUISITOS_CONTRASENA.map((r) => {
        const ok = r.cumple(password);
        return (
          <li key={r.id} className={ok ? "text-green-700" : "text-brand-text/70"}>
            <span aria-hidden="true">{ok ? "✓" : "○"}</span> {r.texto}
            <span className="sr-only">{ok ? " (cumplido)" : " (pendiente)"}</span>
          </li>
        );
      })}
    </ul>
  );
}

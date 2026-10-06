import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full text-center text-xs text-accent-fg/80 py-6 px-4 flex flex-col items-center gap-2">
      <nav aria-label="Información legal" className="flex items-center gap-4">
        <Link href="/privacidad" className="underline underline-offset-2 py-1">
          Política de Privacidad
        </Link>
        <Link href="/terminos" className="underline underline-offset-2 py-1">
          Términos y Condiciones
        </Link>
      </nav>
      <p>© {new Date().getFullYear()} GeoKaia — Todos los derechos reservados</p>
    </footer>
  );
}

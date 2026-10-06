import Link from "next/link";
import Footer from "@/components/Footer";
import { FECHA_ACTUALIZACION, TERMINOS_VERSION } from "@/lib/legal";

// Plantilla de las páginas legales (/terminos y /privacidad): título, vigencia, índice de
// secciones y el cuerpo. Las secciones se pasan como [{ id, titulo, contenido }].

export function P({ children }) {
  return <p className="text-sm leading-relaxed text-brand-text/80">{children}</p>;
}

export function Lista({ items }) {
  return (
    <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm leading-relaxed text-brand-text/80">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function PaginaLegal({ titulo, introduccion, secciones, otroDocumento }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">

      <main id="contenido" className="flex-1 flex flex-col items-center px-4 py-10">
        <article className="w-full max-w-2xl flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-brand-text">{titulo}</h1>
            <p className="text-xs text-brand-text/70">
              Última actualización: {FECHA_ACTUALIZACION} · Versión {TERMINOS_VERSION}
            </p>
            <P>{introduccion}</P>
          </header>

          <nav aria-label="Contenido de esta página" className="rounded-xl border border-secondary/40 bg-surface px-4 py-3">
            <p className="text-sm font-semibold text-brand-text mb-2">Contenido</p>
            <ol className="list-decimal pl-5 grid gap-1 text-sm">
              {secciones.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-accent-fg underline underline-offset-2">
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {secciones.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="flex flex-col gap-3 scroll-mt-4">
              <h2 id={`${s.id}-t`} className="text-lg font-bold text-brand-text">
                {i + 1}. {s.titulo}
              </h2>
              {s.contenido}
            </section>
          ))}

          <p className="text-sm text-brand-text/80 border-t border-secondary/40 pt-4">
            Documento relacionado:{" "}
            <Link href={otroDocumento.href} className="text-accent-fg underline underline-offset-2">
              {otroDocumento.texto}
            </Link>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}

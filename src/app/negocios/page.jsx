import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BENEFICIOS = [
  { icono: "📍", texto: "Pin destacado y animado en el mapa de GeoKaia" },
  { icono: "🖼️", texto: "Galería de fotos y video para mostrar tu negocio" },
  { icono: "🌀", texto: "Visor 360° para que el turista se pasee antes de llegar" },
  { icono: "💬", texto: "Botón directo a WhatsApp y a tu menú" },
];

export default function NegociosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-text">Para Negocios</h1>
            <p className="text-brand-text/80 mt-2">
              Sumá tu negocio al mapa turístico de GeoKaia y llegá a viajeros que
              están buscando exactamente lo que ofrecés.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {BENEFICIOS.map((b) => (
              <li key={b.texto} className="flex items-center gap-3 bg-white border border-secondary/40 rounded-xl px-4 py-3">
                <span className="text-xl">{b.icono}</span>
                <span className="text-sm text-brand-text">{b.texto}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/leads"
              className="flex-1 text-center rounded-lg bg-primary text-white font-semibold px-4 py-3 hover:opacity-90 transition-opacity"
            >
              Quiero saber más
            </Link>
            <Link
              href="/negocio/login"
              className="flex-1 text-center rounded-lg border border-accent-dark text-accent-dark font-semibold px-4 py-3 hover:bg-accent-dark hover:text-white transition-colors"
            >
              Ya soy cliente, iniciar sesión
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

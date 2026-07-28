import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Fase 1: esqueleto. La Fase 4 del roadmap conecta esto con GET /api/rutas
// y agrega un RouteCard por cada ruta con sus paradas.
export default function RutasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        <span className="text-4xl mb-3">📍</span>
        <h1 className="text-xl font-bold text-brand-text mb-1">Lista de recorridos</h1>
        <p className="text-sm text-brand-text/60 max-w-sm">
          Muy pronto vas a poder explorar acá todas las rutas temáticas curadas
          de GeoKaia — Ruta del Arte, Ruta Naturaleza Volcánica, y más.
        </p>
      </main>

      <Footer />
    </div>
  );
}

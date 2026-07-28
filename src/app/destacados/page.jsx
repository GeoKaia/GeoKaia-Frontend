import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Fase 1: esqueleto. La Fase 3 del roadmap conecta esto con GET /api/lugares
// filtrando tier === "PREMIUM" y reusando PlaceCard.
export default function DestacadosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        <span className="text-4xl mb-3">⭐</span>
        <h1 className="text-xl font-bold text-brand-text mb-1">Lugares Destacados</h1>
        <p className="text-sm text-brand-text/60 max-w-sm">
          Acá vas a encontrar los negocios premium de GeoKaia — con galería,
          video y visor 360°.
        </p>
      </main>

      <Footer />
    </div>
  );
}

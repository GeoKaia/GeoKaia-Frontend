import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-brand-text">Sobre GeoKaia</h1>

          <p className="text-brand-text/80">
            GeoKaia centraliza la oferta turística y creativa de Nicaragua en una
            plataforma interactiva que elimina la fricción del descubrimiento.
            Combinamos rutas temáticas curadas con un agente de inteligencia
            artificial de baja latencia que recomienda las experiencias más
            afines a los intereses de cada turista.
          </p>

          <p className="text-brand-text/80">
            A diferencia de los mapas y plataformas tradicionales, GeoKaia le da
            a las MiPymes nicaragüenses un escaparate inmersivo para atraer
            clientes de mayor valor e impulsar un turismo más sostenible.
          </p>

          <p className="text-brand-text/80">
            Somos <span className="font-semibold">Techyardigans</span>, un
            equipo multidisciplinario de ingeniería, urbanismo, diseño y
            negocios, construyendo GeoKaia como proyecto para el Hackathon
            Nicaragua 2026.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PROXIMAMENTE = [
  { icono: "🌗", texto: "Modo oscuro" },
  { icono: "🔤", texto: "Tamaño de letra" },
  { icono: "🗑️", texto: "Borrar cuenta" },
];

export default function AjustesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-brand-text">Ajustes</h1>

          <div className="flex flex-col gap-2">
            {PROXIMAMENTE.map((item) => (
              <div
                key={item.texto}
                className="flex items-center justify-between bg-white border border-secondary/40 rounded-xl px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm text-brand-text">
                  <span className="text-lg">{item.icono}</span>
                  {item.texto}
                </span>
                <span className="text-xs text-brand-text/40">Próximamente</span>
              </div>
            ))}
          </div>

          <div className="bg-white border border-secondary/40 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-brand-text mb-1">¿Necesitás ayuda?</p>
            <p className="text-sm text-brand-text/70">
              Escribinos a{" "}
              <a href="mailto:geokaia404@gmail.com" className="text-accent-dark underline">
                geokaia404@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

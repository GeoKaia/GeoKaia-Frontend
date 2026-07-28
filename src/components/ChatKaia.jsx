// Fase 1: solo el shell visual. La integración real con POST /api/ia/recomendar-ruta
// llega en la Fase 5 del roadmap de la pagina principal.
export default function ChatKaia() {
  return (
    <section className="w-full max-w-2xl flex items-start gap-3 px-4">
      <span className="shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-xl">
        🌋
      </span>

      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-white border border-secondary/40 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
          <p className="text-sm text-brand-text">
            Soy Kaia, tu guía turístico. ¿Qué clase de recorrido te gustaría disfrutar?
          </p>
        </div>

        <input
          type="text"
          disabled
          placeholder="Escribe acá... (próximamente)"
          className="w-full rounded-full border border-secondary/50 px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/40 bg-secondary/10 cursor-not-allowed"
        />
      </div>
    </section>
  );
}

// Imagen "hero" redondeada y contenida (no un banner de borde a borde) para las
// pantallas de login/registro de negocio y admin. El fondo combina 3 capas de CSS
// background, en ESTE orden (la primera es la de más arriba/más cerca del usuario):
// velo oscuro (legibilidad) > foto real > degradé de marca (fallback). El degradé
// tiene que ir última porque una capa opaca en medio tapa todo lo de abajo aunque
// esa capa sí haya cargado — si la foto falla, esa capa simplemente no pinta nada
// y deja ver el degradé de abajo.
const IMAGEN_HERO = "/images/hero-negocios.jpg";

const DEGRADES = {
  negocio: "linear-gradient(135deg, var(--color-primary), var(--color-accent-dark) 65%, var(--color-accent))",
  admin: "linear-gradient(135deg, var(--color-accent-dark), var(--color-brand-text) 70%)",
};

export default function AuthHero({ eyebrow, title, subtitle, tone = "negocio", children, footer }) {
  return (
    <main className="min-h-screen flex flex-col bg-brand-bg">
      <div className="px-4 pt-4">
        <div
          className="relative w-full max-w-md mx-auto h-64 rounded-t-3xl rounded-b-[4rem] overflow-hidden flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.5)), url('${IMAGEN_HERO}'), ${DEGRADES[tone]}`,
          }}
        >
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80 mb-1">{eyebrow}</p>
          )}
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h1>
          {subtitle && <p className="text-sm text-white/85 max-w-xs mt-1">{subtitle}</p>}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 -mt-12 pb-12">
        <div className="w-full max-w-sm rounded-xl border border-secondary/40 bg-white p-6 shadow-lg">
          {children}
        </div>
        {footer}
      </div>
    </main>
  );
}

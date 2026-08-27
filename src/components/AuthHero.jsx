// Imagen "hero" de borde a borde (sin margenes ni bordes redondeados propios) para
// las pantallas de login/registro de negocio y admin. El efecto de "medio circulo"
// no lo hace la foto — lo hace la tarjeta blanca de abajo, que tiene las esquinas
// de arriba muy redondeadas y se monta sobre la foto con un margen negativo.
//
// El fondo de la foto combina 3 capas de CSS background, en ESTE orden (la primera
// es la de más arriba/más cerca del usuario): velo oscuro (legibilidad) > foto real
// > degradé de marca (fallback). El degradé tiene que ir última porque una capa
// opaca en medio tapa todo lo de abajo aunque esa capa sí haya cargado — si la foto
// falla, esa capa simplemente no pinta nada y deja ver el degradé de abajo.
const IMAGEN_HERO = "/images/hero-negocios.jpg";

const DEGRADES = {
  negocio: "linear-gradient(135deg, var(--color-primary), var(--color-accent-dark) 65%, var(--color-accent))",
  admin: "linear-gradient(135deg, var(--color-accent-dark), var(--color-brand-text) 70%)",
};

export default function AuthHero({ eyebrow, iconoEyebrow: IconoEyebrow, title, subtitle, tone = "negocio", children, footer }) {
  return (
    <main className="min-h-screen flex flex-col bg-brand-bg">
      <div
        className="relative w-full h-72 shrink-0 flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.5)), url('${IMAGEN_HERO}'), ${DEGRADES[tone]}`,
        }}
      >
        {eyebrow && (
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 mb-1">
            {IconoEyebrow && <IconoEyebrow size={14} />} {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h1>
        {subtitle && <p className="text-sm text-white/85 max-w-xs mt-1">{subtitle}</p>}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 -mt-14 pb-12">
        <div className="w-full max-w-sm rounded-t-[2.5rem] rounded-b-xl border border-secondary/40 bg-white p-6 pt-10 shadow-lg">
          {children}
        </div>
        {footer}
      </div>
    </main>
  );
}

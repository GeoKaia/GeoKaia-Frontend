"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WifiOff, Clock, ServerCrash, Lock, TriangleAlert, MapPinOff, RefreshCw } from "lucide-react";

// Pantalla de error reutilizable y amigable. Se usa en tres lugares:
//   1) src/app/error.js       -> cualquier fallo inesperado al pintar una pantalla
//   2) src/app/not-found.js   -> URLs que no existen (404)
//   3) dentro de cualquier pantalla (modo `compacto`) cuando una llamada a la API falla:
//        {error && <PantallaError compacto error={error} onReintentar={cargar} />}
//
// Props:
//   error        Error capturado. Si es un ErrorApi (src/lib/api.js) se usa su `tipo` para elegir la
//                variante y su `message`, que ya está escrito para mostrarse tal cual a la persona.
//                Cualquier otro Error NUNCA se muestra al usuario (es técnico): sale el texto genérico.
//   tipo         Fuerza la variante: red | timeout | servidor | sesion | limite | validacion |
//                noEncontrado | inesperado | otro
//   mensaje      Texto propio que reemplaza al de la variante.
//   codigo       Número grande en lugar del ícono (ej. "404").
//   referencia   Código corto para soporte (error.digest). Sirve para ubicar el fallo en los logs.
//   onReintentar Función. Si viene, aparece el botón "Intentar de nuevo". En "red" además se
//                reintenta sola cuando el dispositivo recupera internet.
//   compacto     true = tarjeta dentro de una sección; false = pantalla completa.

const INICIO = { label: "Ir al inicio", href: "/" };
const CORREO = "geokaia404@gmail.com";

const VARIANTES = {
  red: {
    Icono: WifiOff,
    titulo: "Sin conexión",
    mensaje: "No pudimos conectarnos. Revisá tu internet e intentá de nuevo.",
    reintentar: true,
    enlaces: [INICIO],
  },
  timeout: {
    Icono: Clock,
    titulo: "Está tardando más de lo normal",
    mensaje: "El servidor puede estar despertando. Esperá unos segundos e intentá de nuevo.",
    reintentar: true,
    enlaces: [INICIO],
  },
  servidor: {
    Icono: ServerCrash,
    titulo: "Tuvimos un problema de nuestro lado",
    mensaje: "No fue culpa tuya. Intentá de nuevo en unos minutos.",
    reintentar: true,
    contacto: true,
    enlaces: [INICIO],
  },
  sesion: {
    Icono: Lock,
    titulo: "Tu sesión venció",
    mensaje: "Iniciá sesión de nuevo para continuar.",
    reintentar: false,
    enlaces: [{ label: "Iniciar sesión", href: "/negocio/login" }, INICIO],
  },
  limite: {
    Icono: Clock,
    titulo: "Demasiados intentos seguidos",
    mensaje: "Esperá unos minutos antes de intentar de nuevo.",
    reintentar: true,
    enlaces: [INICIO],
  },
  validacion: {
    Icono: TriangleAlert,
    titulo: "Revisá los datos",
    mensaje: "Hay algo que corregir en lo que enviaste.",
    reintentar: false,
    enlaces: [],
  },
  noEncontrado: {
    Icono: MapPinOff,
    titulo: "Este camino no lleva a ningún lugar",
    mensaje: "La página que buscás no existe o fue movida. Volvé al mapa y seguí explorando Nicaragua.",
    reintentar: false,
    enlaces: [{ label: "Volver al inicio", href: "/" }, { label: "Ver rutas", href: "/rutas" }],
  },
  inesperado: {
    Icono: TriangleAlert,
    titulo: "Algo salió mal",
    mensaje: "Tuvimos un problema inesperado. Intentá de nuevo; si sigue pasando, volvé en unos minutos.",
    reintentar: true,
    contacto: true,
    enlaces: [INICIO],
  },
  otro: {
    Icono: TriangleAlert,
    titulo: "No pudimos completar la acción",
    mensaje: "Ocurrió un error inesperado. Intentá de nuevo.",
    reintentar: true,
    enlaces: [INICIO],
  },
};

const BASE_BOTON =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold";
const PRIMARIO = `${BASE_BOTON} bg-accent-dark text-white`;
const SECUNDARIO = `${BASE_BOTON} border border-secondary text-brand-text`;

export default function PantallaError({
  error,
  tipo,
  mensaje,
  codigo,
  referencia,
  onReintentar,
  compacto = false,
}) {
  const tipoFinal = tipo || error?.tipo || "inesperado";
  const variante = VARIANTES[tipoFinal] || VARIANTES.otro;
  const esErrorApi = error?.name === "ErrorApi";
  const texto = mensaje || (esErrorApi ? error.message : variante.mensaje);
  const puedeReintentar = typeof onReintentar === "function" && variante.reintentar;

  // Sin internet: en cuanto el dispositivo se reconecta, se reintenta solo.
  useEffect(() => {
    if (tipoFinal !== "red" || !puedeReintentar) return;
    window.addEventListener("online", onReintentar);
    return () => window.removeEventListener("online", onReintentar);
  }, [tipoFinal, puedeReintentar, onReintentar]);

  const Icono = variante.Icono;
  const Titulo = compacto ? "h2" : "h1";

  const contenido = (
    <>
      {codigo ? (
        <p className="text-7xl font-bold text-primary" aria-hidden="true">
          {codigo}
        </p>
      ) : (
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent-fg">
          <Icono size={32} aria-hidden="true" />
        </span>
      )}

      <Titulo className="mt-4 text-2xl font-semibold text-brand-text">{variante.titulo}</Titulo>
      <p className="mt-2 max-w-sm text-sm text-brand-text/70">{texto}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {puedeReintentar && (
          <button type="button" onClick={onReintentar} className={PRIMARIO}>
            <RefreshCw size={16} aria-hidden="true" />
            Intentar de nuevo
          </button>
        )}
        {variante.enlaces.map((enlace, i) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            className={!puedeReintentar && i === 0 ? PRIMARIO : SECUNDARIO}
          >
            {enlace.label}
          </Link>
        ))}
      </div>

      {(variante.contacto || referencia) && (
        <p className="mt-6 max-w-sm text-xs text-brand-text/60">
          {variante.contacto && (
            <>
              Si el problema sigue, escribinos a{" "}
              <a href={`mailto:${CORREO}`} className="underline">
                {CORREO}
              </a>
              .{" "}
            </>
          )}
          {referencia && (
            <>
              Código de referencia: <span className="font-mono">{referencia}</span>
            </>
          )}
        </p>
      )}
    </>
  );

  if (compacto) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center rounded-2xl border border-secondary/30 bg-surface px-4 py-8 text-center"
      >
        {contenido}
      </div>
    );
  }

  return (
    <main
      id="contenido"
      role="alert"
      className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      {contenido}
    </main>
  );
}
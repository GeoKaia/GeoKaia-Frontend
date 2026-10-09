import Link from "next/link";
import PaginaLegal, { P, Lista } from "@/components/PaginaLegal";
import { CONTACTO_LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Términos y Condiciones | GeoKaia",
  description: "Reglas de uso de GeoKaia para visitantes y negocios: cuentas, planes Gratis y Premium, contenido y responsabilidades.",
};

const correo = (
  <a href={`mailto:${CONTACTO_LEGAL}`} className="text-accent-fg underline underline-offset-2">
    {CONTACTO_LEGAL}
  </a>
);

const SECCIONES = [
  {
    id: "aceptacion",
    titulo: "Aceptación de los términos",
    contenido: (
      <>
        <P>
          Al usar GeoKaia aceptás estos Términos y Condiciones. Si querés crear una cuenta de negocio, además tenés que
          marcar la casilla de aceptación del registro, con lo que confirmás que leíste estos Términos y la{" "}
          <Link href="/privacidad" className="text-accent-fg underline underline-offset-2">
            Política de Privacidad
          </Link>
          . Si no estás de acuerdo, no uses el servicio.
        </P>
        <P>Las cuentas de negocio son solo para personas mayores de 18 años, o que actúen en nombre del negocio con facultades para hacerlo.</P>
      </>
    ),
  },
  {
    id: "servicio",
    titulo: "Qué es GeoKaia",
    contenido: (
      <>
        <P>
          GeoKaia es una guía digital de turismo de Nicaragua: un mapa con lugares, rutas curadas por el equipo, un
          asistente con inteligencia artificial (Kaia) y un espacio para que los negocios turísticos se den a conocer.
        </P>
        <P>
          GeoKaia no es una agencia de viajes ni vende tours, reservas, comida ni alojamiento: los servicios los presta
          cada negocio. La información de los lugares (horarios, precios, contacto, fotos) la cargan los negocios o el
          equipo y puede cambiar o tener errores; confirmala directamente con el negocio antes de viajar.
        </P>
      </>
    ),
  },
  {
    id: "visitantes",
    titulo: "Uso permitido",
    contenido: (
      <>
        <P>Podés explorar GeoKaia libremente. Te pedimos no:</P>
        <Lista
          items={[
            "Usar la plataforma para actividades ilegales, para engañar o para acosar a otras personas.",
            "Intentar acceder sin permiso a cuentas, datos o sistemas, ni interferir con el funcionamiento del servicio.",
            "Copiar de forma masiva el contenido, la marca o el diseño de GeoKaia sin autorización.",
            "Enviar al chat de Kaia datos personales o sensibles, o mensajes ofensivos.",
          ]}
        />
      </>
    ),
  },
  {
    id: "cuentas",
    titulo: "Cuentas de negocio",
    contenido: (
      <>
        <Lista
          items={[
            "Los datos que das al registrarte tienen que ser verdaderos y estar actualizados.",
            "Cada cuenta puede tener un (1) lugar. Cuidá tu contraseña y tu verificación en dos pasos (2FA): sos responsable de lo que se haga con tu cuenta.",
            "Los lugares nuevos quedan en revisión y se publican en el mapa cuando el equipo de GeoKaia los aprueba. El equipo puede aprobar, rechazar, corregir (por ejemplo la ubicación del pin o errores de texto) o retirar un lugar.",
            "Podés editar o borrar tu lugar, y borrar tu cuenta, desde tu panel y desde Ajustes.",
          ]}
        />
      </>
    ),
  },
  {
    id: "contenido",
    titulo: "Contenido que publicás",
    contenido: (
      <>
        <P>Sos responsable de todo lo que cargás en tu lugar. Al publicarlo declarás que:</P>
        <Lista
          items={[
            "Es verdadero y no engaña a las personas visitantes (por ejemplo, precios, horarios o fotos que no corresponden).",
            "Tenés derecho a usar las fotos, videos, audios y demás materiales que cargás, o la autorización de quien los creó.",
            "No infringe derechos de terceros ni contiene contenido ilegal u ofensivo.",
            "Los enlaces corresponden a lo que dicen ser: la foto principal debe ser una imagen, y los botones de Google Maps y Waze deben llevar a esos servicios.",
          ]}
        />
        <P>
          Nos das permiso, no exclusivo y mientras tu lugar esté publicado, para mostrar ese contenido en GeoKaia. Seguís
          siendo titular de tu contenido.
        </P>
      </>
    ),
  },
  {
    id: "planes",
    titulo: "Planes Gratis y Premium",
    contenido: (
      <>
        <P>
          El plan Gratis incluye tu pin en el mapa con enlaces a Waze y Google Maps y los datos básicos del lugar. El plan
          Premium agrega foto 360°, video, galería de fotos, menú digital y audio descriptivo, y se informa con un precio
          de referencia de USD 10 por mes.
        </P>
        <P>
          Los pagos en línea todavía no están habilitados: durante esta etapa el plan Premium se activa sin costo para que
          puedas probarlo. Antes de cobrar cualquier monto vamos a mostrarte con claridad el precio total, la moneda, la
          periodicidad y cómo cancelar, y vas a poder aceptarlo o no.
        </P>
      </>
    ),
  },
  {
    id: "ia",
    titulo: "Recomendaciones de Kaia",
    contenido: (
      <P>
        Kaia usa inteligencia artificial para sugerir rutas con los lugares cargados en GeoKaia. Sus respuestas son
        orientativas, pueden ser incompletas o equivocadas y no reemplazan tu criterio ni la información oficial. GeoKaia
        no se hace responsable por las decisiones que tomes solo con base en ellas.
      </P>
    ),
  },
  {
    id: "terceros",
    titulo: "Servicios de terceros",
    contenido: (
      <P>
        GeoKaia muestra enlaces y mapas de terceros (Google Maps, Waze, WhatsApp, OpenStreetMap, MapTiler, plataformas de
        video y otros). No controlamos esos servicios y se rigen por sus propios términos y políticas de privacidad.
      </P>
    ),
  },
  {
    id: "propiedad",
    titulo: "Propiedad intelectual",
    contenido: (
      <P>
        El nombre, el logo, el diseño y el software de GeoKaia pertenecen al equipo Techyardigans. Los mapas son © OpenStreetMap
        y MapTiler. El contenido que cargan los negocios sigue siendo de sus titulares.
      </P>
    ),
  },
  {
    id: "disponibilidad",
    titulo: "Disponibilidad del servicio",
    contenido: (
      <P>
        GeoKaia está en desarrollo activo. Puede tener interrupciones, errores o cambios en sus funciones, y podemos
        modificar o dejar de ofrecer partes del servicio. Haremos lo razonable por avisar los cambios importantes.
      </P>
    ),
  },
  {
    id: "responsabilidad",
    titulo: "Responsabilidad",
    contenido: (
      <>
        <P>
          En la medida que la ley lo permita, GeoKaia no responde por la información que publican los negocios, por la
          calidad o el cumplimiento de los servicios que ellos prestan, ni por daños que surjan de confiar en información
          del sitio sin confirmarla.
        </P>
        <P>
          Nada de lo anterior limita los derechos que la Ley No. 842, Ley de Protección de los Derechos de las Personas
          Consumidoras y Usuarias, te reconoce y que no se pueden renunciar.
        </P>
      </>
    ),
  },
  {
    id: "suspension",
    titulo: "Suspensión y baja",
    contenido: (
      <P>
        Podemos retirar contenido o suspender una cuenta que incumpla estos Términos, por ejemplo por información falsa,
        contenido ilegal o intentos de abuso del servicio. Vos podés dejar de usar GeoKaia y borrar tu cuenta cuando
        quieras.
      </P>
    ),
  },
  {
    id: "privacidad",
    titulo: "Privacidad de tus datos",
    contenido: (
      <P>
        El tratamiento de tus datos personales se rige por nuestra{" "}
        <Link href="/privacidad" className="text-accent-fg underline underline-offset-2">
          Política de Privacidad
        </Link>
        , que forma parte de estos Términos.
      </P>
    ),
  },
  {
    id: "contacto",
    titulo: "Contacto y reclamos",
    contenido: (
      <>
        <P>Para consultas, reclamos o sugerencias escribinos a {correo}. Intentaremos responderte lo antes posible.</P>
        <P>
          También podés acudir a la Dirección General de Protección de los Derechos de las Personas Consumidoras y Usuarias
          (DIPRODEC) del Ministerio de Fomento, Industria y Comercio (MIFIC).
        </P>
      </>
    ),
  },
  {
    id: "ley",
    titulo: "Ley aplicable y cambios",
    contenido: (
      <>
        <P>Estos Términos se rigen por las leyes de la República de Nicaragua.</P>
        <P>
          Podemos actualizarlos. Publicaremos la nueva versión en esta página con su fecha y, si el cambio es importante,
          te lo avisaremos en la plataforma. Si seguís usando GeoKaia después del cambio, se entiende que aceptás la nueva
          versión.
        </P>
      </>
    ),
  },
];

export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Términos y Condiciones"
      introduccion="Estas son las reglas para usar GeoKaia, tanto si solo explorás el mapa como si registrás un negocio. Leelas con calma: son cortas y están escritas para que se entiendan."
      secciones={SECCIONES}
      otroDocumento={{ href: "/privacidad", texto: "Política de Privacidad" }}
    />
  );
}

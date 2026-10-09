import PaginaLegal, { P, Lista } from "@/components/PaginaLegal";
import { CONTACTO_LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Política de Privacidad | GeoKaia",
  description: "Qué datos personales trata GeoKaia, para qué, con quién los comparte y cómo ejercer tus derechos (Ley 787).",
};

const correo = (
  <a href={`mailto:${CONTACTO_LEGAL}`} className="text-accent-fg underline underline-offset-2">
    {CONTACTO_LEGAL}
  </a>
);

const SECCIONES = [
  {
    id: "responsable",
    titulo: "Quién es el responsable",
    contenido: (
      <>
        <P>
          GeoKaia es una plataforma de turismo digital de Nicaragua desarrollada por el equipo Techyardigans. El equipo
          de GeoKaia es el responsable del tratamiento de los datos personales descritos en esta política.
        </P>
        <P>Para cualquier consulta sobre tus datos podés escribirnos a {correo}.</P>
      </>
    ),
  },
  {
    id: "datos",
    titulo: "Qué datos tratamos",
    contenido: (
      <>
        <P>
          <strong>Si solo explorás GeoKaia</strong> (mapa, rutas, lugares destacados): no te pedimos datos personales ni
          que crees una cuenta. La aplicación no accede a la ubicación de tu dispositivo.
        </P>
        <P>
          <strong>Si le escribís a Kaia</strong> (el chat con inteligencia artificial): el texto que escribís se envía a
          nuestro servidor y a un proveedor de IA para generar la recomendación. No escribas datos personales ni
          sensibles en el chat.
        </P>
        <P>
          <strong>Si creás una cuenta de negocio:</strong>
        </P>
        <Lista
          items={[
            "Correo electrónico y contraseña (la contraseña se guarda cifrada, nunca en texto plano).",
            "Nombre de contacto y número de WhatsApp.",
            "El código secreto de verificación en dos pasos (2FA) de tu cuenta.",
            "La fecha y la versión de los Términos y de esta Política que aceptaste.",
            "El contenido del lugar que registrás: nombre, descripción, categoría, ubicación en el mapa, horarios, fotos y enlaces, WhatsApp comercial y el plan elegido.",
          ]}
        />
        <P>
          <strong>Si nos dejás tus datos en el formulario “Para negocios”:</strong> nombre del negocio, nombre de
          contacto, WhatsApp y el mensaje que escribas.
        </P>
        <P>
          <strong>Datos técnicos:</strong> como cualquier sitio web, los servidores de nuestros proveedores pueden
          registrar datos de conexión (por ejemplo, la dirección IP y el tipo de navegador) por motivos de seguridad y
          funcionamiento.
        </P>
        <P>
          GeoKaia no solicita datos sensibles (origen racial o étnico, filiación política, creencias religiosas,
          salud, vida sexual, entre otros) y te pedimos que no los incluyas en ningún campo.
        </P>
      </>
    ),
  },
  {
    id: "finalidades",
    titulo: "Para qué usamos tus datos",
    contenido: (
      <>
        <Lista
          items={[
            "Crear y proteger tu cuenta de negocio, y verificar tu identidad al iniciar sesión.",
            "Revisar, aprobar y mostrar en el mapa público el lugar que registrás.",
            "Responder consultas y contactar a los negocios interesados en GeoKaia.",
            "Generar las recomendaciones de rutas del chat de Kaia.",
            "Mantener la seguridad del servicio, prevenir abusos y corregir errores.",
            "Mejorar la plataforma.",
          ]}
        />
        <P>
          No vendemos tus datos personales ni los usamos para publicidad de terceros. Las recomendaciones de Kaia son
          orientativas: no producen efectos jurídicos sobre vos.
        </P>
      </>
    ),
  },
  {
    id: "consentimiento",
    titulo: "Tu consentimiento",
    contenido: (
      <>
        <P>
          Tratamos tus datos con tu consentimiento libre, específico e informado, como establece la Ley No. 787, Ley de
          Protección de Datos Personales, y su Reglamento. En la cuenta de negocio lo das de forma expresa marcando la
          casilla de aceptación al registrarte; guardamos la fecha y la versión de lo que aceptaste.
        </P>
        <P>
          Podés retirar tu consentimiento cuando quieras borrando tu lugar o tu cuenta (ver “Tus derechos”). Retirarlo no
          afecta el tratamiento que se hizo antes.
        </P>
        <P>
          Lo que publicás en tu lugar (por ejemplo el WhatsApp comercial, la dirección o las fotos) es público una vez
          aprobado: cargalo solo si querés que lo vea cualquier persona.
        </P>
      </>
    ),
  },
  {
    id: "terceros",
    titulo: "Con quién compartimos los datos",
    contenido: (
      <>
        <P>
          Para que GeoKaia funcione usamos proveedores que tratan datos por nuestra cuenta, únicamente para prestar su
          servicio:
        </P>
        <Lista
          items={[
            "Vercel: hospedaje del sitio web.",
            "Render: hospedaje del servidor (API).",
            "Neon: base de datos donde se guardan las cuentas, los lugares y las rutas.",
            "Groq: proveedor de inteligencia artificial que procesa las consultas al chat de Kaia.",
            "MapTiler y OpenStreetMap: mapas. Al cargar el mapa tu navegador se conecta a sus servidores.",
          ]}
        />
        <P>
          Estos proveedores operan servidores fuera de Nicaragua (principalmente en Estados Unidos), por lo que tus datos
          pueden tratarse en otro país. Los botones de Google Maps, Waze, WhatsApp y los enlaces a videos o fotos te
          llevan a servicios de terceros, que se rigen por sus propias políticas.
        </P>
        <P>
          Solo entregaremos datos a una autoridad cuando una ley o una orden competente nos lo exija.
        </P>
      </>
    ),
  },
  {
    id: "dispositivo",
    titulo: "Lo que guardamos en tu dispositivo",
    contenido: (
      <>
        <P>
          GeoKaia no usa cookies de publicidad ni de seguimiento, y no tiene herramientas de analítica de terceros. Sí
          guarda en tu navegador lo mínimo para funcionar:
        </P>
        <Lista
          items={[
            "gk_sesion (cookie): tu sesión de negocio o de administración. Es una cookie técnica, httpOnly (los scripts de la página no pueden leerla) y vence a las 8 horas o al cerrar sesión.",
            "geokaia-onboarding (almacenamiento local): que ya viste la bienvenida.",
            "geokaia-theme y geokaia-font-scale (almacenamiento local): tus preferencias de modo oscuro y tamaño de letra.",
          ]}
        />
        <P>Podés borrarlos en cualquier momento desde la configuración de tu navegador.</P>
      </>
    ),
  },
  {
    id: "conservacion",
    titulo: "Cuánto tiempo los conservamos",
    contenido: (
      <>
        <Lista
          items={[
            "Cuenta y lugar de negocio: mientras la cuenta exista. Al borrarla (Ajustes → Borrar cuenta) se elimina la cuenta y el lugar asociado.",
            "Formulario “Para negocios”: el tiempo necesario para atender tu solicitud.",
            "Registros técnicos de los proveedores: según los plazos de cada proveedor.",
          ]}
        />
      </>
    ),
  },
  {
    id: "derechos",
    titulo: "Tus derechos",
    contenido: (
      <>
        <P>
          Como titular de tus datos tenés derecho a ser informado sobre su tratamiento y a acceder, rectificar, actualizar,
          complementar, oponerte y cancelar (suprimir) tus datos personales.
        </P>
        <Lista
          items={[
            "Rectificar o actualizar: editá tu lugar desde tu panel de negocio.",
            "Cancelar o suprimir: borrá tu lugar desde el panel o tu cuenta desde Ajustes.",
            "Acceder, oponerte o cualquier otra solicitud: escribinos a nuestro correo, indicando qué querés pedir y desde qué correo te registraste, para poder verificar que sos vos.",
          ]}
        />
        <P>
          Responderemos tu solicitud lo antes posible. Si considerás que tus derechos no fueron respetados, podés presentar
          un reclamo ante la Dirección de Protección de Datos Personales (DIPRODAP), adscrita al Ministerio de Hacienda y
          Crédito Público, autoridad de aplicación de la Ley No. 787. Si sos menor de edad, tu madre, padre o tutor puede
          ejercer estos derechos por vos.
        </P>
      </>
    ),
  },
  {
    id: "seguridad",
    titulo: "Cómo protegemos tus datos",
    contenido: (
      <>
        <Lista
          items={[
            "Las contraseñas se guardan cifradas (hash) y no se pueden leer.",
            "Las cuentas de negocio usan verificación en dos pasos (2FA) y sesiones que vencen.",
            "La comunicación entre tu navegador y nuestros servidores va cifrada (HTTPS).",
            "Las acciones de administración requieren una cuenta con permisos de administrador.",
          ]}
        />
        <P>
          Ninguna medida es infalible. Si detectamos un incidente que afecte tus datos personales, te lo comunicaremos.
          Cuidá tu contraseña y tu código de verificación y no los compartas.
        </P>
      </>
    ),
  },
  {
    id: "menores",
    titulo: "Menores de edad",
    contenido: (
      <P>
        Explorar el mapa y las rutas no requiere datos personales. Las cuentas de negocio son solo para personas mayores de
        18 años. Si sos menor de edad, usá el chat de Kaia con acompañamiento de una persona adulta y no compartas datos
        personales.
      </P>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en esta política",
    contenido: (
      <P>
        Podemos actualizar esta política. Publicaremos la nueva versión en esta página con su fecha y, si el cambio es
        importante, te lo avisaremos en la plataforma. La versión que aceptaste al registrarte queda registrada en tu
        cuenta.
      </P>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Política de Privacidad"
      introduccion="Esta política explica qué datos personales trata GeoKaia, para qué los usa, con quién los comparte y cómo podés ejercer tus derechos, de acuerdo con la Ley No. 787, Ley de Protección de Datos Personales de Nicaragua."
      secciones={SECCIONES}
      otroDocumento={{ href: "/terminos", texto: "Términos y Condiciones" }}
    />
  );
}

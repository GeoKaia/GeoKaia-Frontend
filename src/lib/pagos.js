// Pasarela de pago SIMULADA para la demo del plan Premium.
// Cada proveedor puede tener un link de pago real (Banpro, Pagadito) configurado por variable de entorno:
//  - Con link: el botón lo abre en otra pestaña (el negocio ve la página real del proveedor).
//  - Sin link: se muestra una pantalla simulada de la redirección.
// En los dos casos el flujo sigue con "Ya pagué — continuar con la demo", así la demostración no se corta
// aunque el pago no se complete. Nunca se piden ni se guardan datos de tarjeta en GeoKaia.
// NEXT_PUBLIC_*: los links de pago son públicos por naturaleza (cualquiera puede abrirlos).
export const PROVEEDORES_PAGO = [
  {
    id: "banpro",
    nombre: "Banpro",
    detalle: "Link de pago de Banpro",
    url: process.env.NEXT_PUBLIC_PAGO_BANPRO_URL || "",
  },
  {
    id: "pagadito",
    nombre: "Pagadito",
    detalle: "Pago con Pagadito",
    url: process.env.NEXT_PUBLIC_PAGO_PAGADITO_URL || "",
  },
];

// Solo se abren links https: evita que una variable mal puesta mande al usuario a un esquema raro (javascript:, data:).
export function urlDePagoValida(url) {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

// Requisitos de contraseña para cuentas nuevas. Espejo de la política del backend (src/utils/password.js):
// el servidor es quien manda, esto solo avisa antes de enviar el formulario.
export const REQUISITOS_CONTRASENA = [
  { id: "largo", texto: "Al menos 12 caracteres", cumple: (p) => p.length >= 12 },
  { id: "mayuscula", texto: "Una letra mayúscula", cumple: (p) => /\p{Lu}/u.test(p) },
  { id: "numero", texto: "Un número", cumple: (p) => /\d/.test(p) },
  { id: "simbolo", texto: "Un símbolo (! ? # $ % & *)", cumple: (p) => /[^\p{L}\d\s]/u.test(p) },
];

export function contrasenaValida(password) {
  return REQUISITOS_CONTRASENA.every((r) => r.cumple(password || ""));
}

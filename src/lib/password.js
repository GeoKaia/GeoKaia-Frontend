// Política de contraseñas de GeoKaia (para todas las cuentas). Tiene que coincidir con GeoKaia-Backend/src/utils/password.js:
// el backend es quien decide (repite todas las validaciones); esto solo adelanta el aviso mientras se escribe.
// El inicio de sesión NO la aplica: las cuentas anteriores tienen que poder seguir entrando.
//
// Requisitos: al menos 12 caracteres, una mayúscula, un número y un carácter especial. Se permiten minúsculas, espacios
// y cualquier otro carácter; el máximo (128) es solo un tope técnico.
export const MINIMO = 12;
export const MAXIMO = 128;

export const REQUISITOS = [
  { id: "longitud", texto: `Al menos ${MINIMO} caracteres`, cumple: (p) => [...p].length >= MINIMO },
  { id: "mayuscula", texto: "Una letra mayúscula (A-Z)", cumple: (p) => /\p{Lu}/u.test(p) },
  { id: "numero", texto: "Un número (0-9)", cumple: (p) => /[0-9]/.test(p) },
  { id: "especial", texto: "Un carácter especial (! @ # $ % & * ?)", cumple: (p) => /[^\p{L}\p{N}\s]/u.test(p) },
];

const BASES_COMUNES = new Set(["password", "contrasena", "contrasenia", "qwertyuiop", "administrador", "abcdefghijkl", "geokaia", "nicaragua"]);

const soloLetras = (p) =>
  p
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "");

function contieneCorreo(password, email) {
  const local = String(email || "").split("@")[0].toLowerCase();
  return local.length >= 4 && password.toLowerCase().includes(local);
}

// Devuelve todos los problemas (texto listo para mostrar); lista vacía = cumple. Nunca incluye la contraseña.
export function erroresDePassword(password, email) {
  if (!password) return ["La contraseña es obligatoria."];
  const errores = REQUISITOS.filter((r) => !r.cumple(password)).map((r) => `Falta: ${r.texto.toLowerCase()}.`);
  if ([...password].length > MAXIMO) errores.push(`No puede pasar de ${MAXIMO} caracteres.`);
  if (BASES_COMUNES.has(soloLetras(password))) errores.push("Es demasiado común: elegí una que no sea una clave conocida.");
  if (contieneCorreo(password, email)) errores.push("No puede contener tu correo.");
  return errores;
}

// Primer problema o null. Lo usan los formularios antes de enviar.
export function validarPassword(password, email) {
  const errores = erroresDePassword(password, email);
  return errores.length ? `La contraseña no cumple los requisitos. ${errores.join(" ")}` : null;
}

// Política de contraseñas para cuentas nuevas. Tiene que coincidir con GeoKaia-Backend/src/utils/password.js:
// el backend es quien manda (esto solo adelanta el aviso en el formulario).
// El inicio de sesión NO la aplica: las cuentas anteriores a esta regla tienen que poder seguir entrando.
export const MINIMO = 12;
export const MAXIMO = 72;

const PROHIBIDAS = ["password", "contrasena", "contraseña", "123456", "qwerty", "abcdef", "geokaia", "nicaragua"];

export const REQUISITOS = [
  { id: "longitud", texto: `Al menos ${MINIMO} caracteres`, cumple: (p) => p.length >= MINIMO && p.length <= MAXIMO },
  { id: "minuscula", texto: "Una letra minúscula", cumple: (p) => /[a-z]/.test(p) },
  { id: "mayuscula", texto: "Una letra mayúscula", cumple: (p) => /[A-Z]/.test(p) },
  { id: "numero", texto: "Un número", cumple: (p) => /\d/.test(p) },
  { id: "simbolo", texto: "Un símbolo (por ejemplo ! ? # $ %)", cumple: (p) => /[^A-Za-z0-9\s]/.test(p) },
  { id: "espacios", texto: "Sin espacios", cumple: (p) => !/\s/.test(p) },
];

function contieneCorreo(password, email) {
  const local = String(email || "").split("@")[0].toLowerCase();
  return local.length >= 4 && password.toLowerCase().includes(local);
}

// Devuelve el primer problema (texto listo para mostrar) o null si la contraseña es válida.
export function validarPassword(password, email) {
  if (!password) return "La contraseña es obligatoria.";
  const incumplido = REQUISITOS.find((r) => !r.cumple(password));
  if (incumplido) return `La contraseña no cumple: ${incumplido.texto.toLowerCase()}.`;
  if (PROHIBIDAS.some((w) => password.toLowerCase().includes(w)))
    return "La contraseña es demasiado común o contiene el nombre de la plataforma.";
  if (contieneCorreo(password, email)) return "La contraseña no puede contener tu correo.";
  return null;
}

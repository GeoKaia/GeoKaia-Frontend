import { useEffect, useState } from "react";
import datos from "../data/datos-nicaragua.json";

function elegir(excluirId) {
  if (datos.length < 2) return datos[0] ?? null;
  let candidato;
  do {
    candidato = datos[Math.floor(Math.random() * datos.length)];
  } while (candidato.id === excluirId);
  return candidato;
}

/**
 * Devuelve un dato curioso de Nicaragua elegido al azar y lo cambia cada
 * `intervalo` ms (útil cuando la carga es larga, como el arranque del servidor).
 * Devuelve null en el primer render: el dato se elige después de montar para que
 * el servidor y el navegador rendericen lo mismo y no haya errores de hidratación.
 */
export function useDatoNicaragua(intervalo = 7000) {
  const [dato, setDato] = useState(null);

  useEffect(() => {
    const inicio = setTimeout(() => setDato(elegir()), 0);
    const rotacion = setInterval(() => setDato((actual) => elegir(actual?.id)), intervalo);
    return () => {
      clearTimeout(inicio);
      clearInterval(rotacion);
    };
  }, [intervalo]);

  return dato;
}
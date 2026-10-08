"use client";

import { useDatoNicaragua } from "../../lib/useDatoNicaragua";

/**
 * Bloque "¿Sabías que…?" con un dato curioso al azar. Reserva su altura para que
 * el loader no salte cuando aparece el texto. Los colores y tamaños los pone
 * cada loader mediante `claseTitulo` y `claseTexto`.
 */
export default function DatoNicaragua({
  titulo = "¿Sabías que…?",
  className = "min-h-[9.5rem]",
  claseTitulo = "",
  claseTexto = "",
}) {
  const dato = useDatoNicaragua();

  return (
    <div
      aria-live="off"
      className={`flex w-full max-w-[22rem] flex-col items-center ${className}`}
    >
      <p className={claseTitulo}>{titulo}</p>
      {dato && (
        <p key={dato.id} className={`loader-dato ${claseTexto}`}>
          {dato.texto}
        </p>
      )}
    </div>
  );
}
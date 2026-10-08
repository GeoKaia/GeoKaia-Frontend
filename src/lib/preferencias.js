// Preferencias de accesibilidad guardadas en el dispositivo: modo oscuro y tamaño de letra.
// Este archivo es solo constantes y texto (sin "use client") para poder importarlo desde el layout
// del servidor; los hooks que las leen y cambian están en usePreferencias.js.
export const CLAVE_TEMA = "geokaia-theme"; // "dark" | "light"
export const CLAVE_TAMANO = "geokaia-font-scale"; // "normal" | "grande" | "muy-grande"
export const TAMANOS = ["normal", "grande", "muy-grande"];

// Script que corre ANTES del primer pintado (va en el <head> del layout) para aplicar las preferencias
// sin que se vea un destello del tema equivocado. El tema por defecto es el claro (no se sigue el del
// sistema operativo): el oscuro solo se activa con el interruptor de Ajustes y esa elección se recuerda.
export const SCRIPT_PREFERENCIAS = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem(${JSON.stringify(CLAVE_TEMA)});
var oscuro=t==="dark";
if(oscuro)d.classList.add("dark");
var s=localStorage.getItem(${JSON.stringify(CLAVE_TAMANO)});
if(s==="grande"||s==="muy-grande")d.dataset.fontScale=s;
}catch(e){}})();`;

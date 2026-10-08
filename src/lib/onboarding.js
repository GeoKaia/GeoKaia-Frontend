// Marca de "ya vio el onboarding". El valor lleva versión: si algún día cambia mucho la
// bienvenida, subir ONBOARDING_VERSION hace que se vuelva a mostrar una vez.
export const ONBOARDING_KEY = "geokaia-onboarding";
export const ONBOARDING_VERSION = "v1";

// Si el navegador bloquea el almacenamiento (modo privado estricto, cookies off) devolvemos
// `true`: preferimos no mostrar el onboarding antes que redirigir en bucle en cada visita.
export function onboardingVisto() {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === ONBOARDING_VERSION;
  } catch {
    return true;
  }
}

export function marcarOnboardingVisto() {
  try {
    window.localStorage.setItem(ONBOARDING_KEY, ONBOARDING_VERSION);
  } catch {
    // sin almacenamiento: no pasa nada, onboardingVisto() ya asume "visto"
  }
}

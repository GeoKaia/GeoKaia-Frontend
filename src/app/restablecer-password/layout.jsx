// El enlace de restablecimiento lleva un token secreto en la dirección: esta página no manda el Referer a ningún otro
// sitio (por ejemplo a un recurso externo que cargue) y no debe indexarse.
export const metadata = {
  title: "Restablecer contraseña — GeoKaia",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function RestablecerLayout({ children }) {
  return children;
}

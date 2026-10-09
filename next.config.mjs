/** @type {import('next').NextConfig} */

const UN_ANO = 60 * 60 * 24 * 365;
const UNA_SEMANA = 60 * 60 * 24 * 7;

const nextConfig = {
  // No anunciar el framework en cada respuesta.
  poweredByHeader: false,
  // Respuestas comprimidas con gzip (Nginx las comprimirá también cuando esté delante).
  compress: true,

  images: {
    // AVIF y WebP pesan mucho menos que JPG/PNG; el navegador recibe el que soporte.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Las fotos de lugares cargadas desde Wikimedia Commons se redimensionan y se sirven desde nuestro dominio
    // (ver components/ImagenRemota.jsx). Special:FilePath redirige a upload.wikimedia.org.
    remotePatterns: [
      { protocol: "https", hostname: "commons.wikimedia.org", pathname: "/wiki/Special:FilePath/**" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  async headers() {
    return [
      // Los archivos de /_next/static llevan hash en el nombre: nunca cambian, se cachean un año.
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${UN_ANO}, immutable` }],
      },
      // Íconos, imágenes y el GeoJSON de los departamentos: cambian muy de vez en cuando.
      {
        source: "/:carpeta(icons|images|geo)/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${UNA_SEMANA}, stale-while-revalidate=86400` }],
      },
      // Cabeceras de seguridad básicas para toda la web.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

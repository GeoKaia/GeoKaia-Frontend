// URL del backend (solo del lado del servidor; no se expone al navegador). Local: http://localhost:4000
const BACKEND_URL = (process.env.BACKEND_URL || "https://geokaia-backend.onrender.com").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // El navegador llama a /api/... en el MISMO dominio del frontend y Next reenvía la petición al backend. Así la
  // cookie de sesión (httpOnly) es de primera parte: funciona igual en Chrome, Safari y Firefox sin depender de
  // cookies de terceros, y el token nunca pasa por JavaScript.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;

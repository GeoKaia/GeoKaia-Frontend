"use client";

import { useEffect } from "react";

// Último recurso: se usa cuando falla el layout raíz. Como el layout no existe en ese
// momento, esta pantalla trae su propio <html> y usa estilos en línea (sin Tailwind).
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          background: "#ffffff",
          color: "#3A2B1D",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <main role="alert">
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px" }}>Algo salió mal</h1>
          <p style={{ fontSize: 14, margin: "0 auto 24px", maxWidth: 360, opacity: 0.75 }}>
            Tuvimos un problema inesperado. Intentá de nuevo; si sigue pasando, volvé en unos
            minutos.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#10546F",
              color: "#ffffff",
              border: 0,
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Intentar de nuevo
          </button>
          <p style={{ fontSize: 12, marginTop: 24, opacity: 0.6 }}>
            Si el problema sigue, escribinos a{" "}
            <a href="mailto:geokaia404@gmail.com" style={{ color: "inherit" }}>
              geokaia404@gmail.com
            </a>
            .{error?.digest ? <> Código de referencia: <code>{error.digest}</code></> : null}
          </p>
        </main>
      </body>
    </html>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { obtenerMiLugar, actualizarMiLugar } from "@/lib/api";
import { obtenerToken, borrarToken } from "@/lib/auth";

const CAMPOS_TEXTO = [
  { name: "descripcion", label: "Descripción", tipo: "textarea" },
  { name: "subcategoria", label: "Subcategoría (ej. Catedrales, Reservas naturales)", tipo: "input" },
  { name: "horarios", label: "Horarios", tipo: "input" },
  { name: "fotoUrl", label: "URL de la foto principal", tipo: "input" },
  { name: "videoUrl", label: "URL del video", tipo: "input" },
  { name: "panoramaUrl", label: "URL del visor 360°", tipo: "input" },
  { name: "whatsapp", label: "WhatsApp (solo números, con código de país)", tipo: "input" },
  { name: "menuUrl", label: "URL del menú", tipo: "input" },
];

const CAMPO_VACIO = {
  descripcion: "",
  subcategoria: "",
  horarios: "",
  fotoUrl: "",
  videoUrl: "",
  panoramaUrl: "",
  whatsapp: "",
  menuUrl: "",
  galeriaUrls: "",
};

export default function PanelNegocioPage() {
  const router = useRouter();
  const [estado, setEstado] = useState("cargando"); // cargando | sin-token | sin-lugar | listo | error
  const [lugar, setLugar] = useState(null);
  const [form, setForm] = useState(CAMPO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    obtenerMiLugar(token)
      .then((data) => {
        setLugar(data);
        setForm({
          descripcion: data.descripcion || "",
          subcategoria: data.subcategoria || "",
          horarios: data.horarios || "",
          fotoUrl: data.fotoUrl || "",
          videoUrl: data.videoUrl || "",
          panoramaUrl: data.panoramaUrl || "",
          whatsapp: data.whatsapp || "",
          menuUrl: data.menuUrl || "",
          galeriaUrls: (data.galeriaUrls || []).join("\n"),
        });
        setEstado("listo");
      })
      .catch((err) => {
        if (err.message.includes("todavía no tiene un lugar")) {
          setEstado("sin-lugar");
        } else if (err.message.includes("Token") || err.message.includes("autorizado")) {
          borrarToken();
          setEstado("sin-token");
        } else {
          setError(err.message);
          setEstado("error");
        }
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setGuardado(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    // Solo mandamos campos con contenido: el backend rechaza URLs vacías como invalidas.
    const cambios = {};
    for (const campo of Object.keys(CAMPO_VACIO)) {
      if (campo === "galeriaUrls") continue;
      const valor = form[campo].trim();
      if (valor) cambios[campo] = valor;
    }
    const galeria = form.galeriaUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (galeria.length > 0) cambios.galeriaUrls = galeria;

    setGuardando(true);
    setError(null);
    try {
      const data = await actualizarMiLugar(token, cambios);
      setLugar(data.lugar);
      setGuardado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        {estado === "cargando" && (
          <p className="text-brand-text/60 animate-pulse">Cargando tu panel...</p>
        )}

        {estado === "sin-token" && (
          <div className="text-center max-w-sm">
            <p className="text-brand-text/80 mb-4">Necesitás iniciar sesión para ver tu panel de negocio.</p>
            <button
              onClick={() => router.push("/negocio/login")}
              className="rounded-lg bg-primary text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
            >
              Iniciar sesión
            </button>
          </div>
        )}

        {estado === "sin-lugar" && (
          <div className="text-center max-w-sm">
            <p className="text-brand-text/80">
              Todavía no tenés un lugar asociado a tu cuenta. Escribinos a{" "}
              <a href="mailto:geokaia404@gmail.com" className="text-accent-dark underline">
                geokaia404@gmail.com
              </a>{" "}
              para darlo de alta.
            </p>
          </div>
        )}

        {estado === "error" && <p className="text-red-600 text-sm">{error}</p>}

        {estado === "listo" && lugar && (
          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-brand-text">{lugar.nombre}</h1>
                <p className="text-xs text-brand-text/50">Editá el contenido de tu lugar en GeoKaia</p>
              </div>

              {CAMPOS_TEXTO.map((campo) =>
                campo.tipo === "textarea" ? (
                  <div key={campo.name}>
                    <label htmlFor={campo.name} className="mb-1 block text-sm font-medium text-brand-text">
                      {campo.label}
                    </label>
                    <textarea
                      id={campo.name}
                      name={campo.name}
                      rows={3}
                      value={form[campo.name]}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ) : (
                  <div key={campo.name}>
                    <label htmlFor={campo.name} className="mb-1 block text-sm font-medium text-brand-text">
                      {campo.label}
                    </label>
                    <input
                      id={campo.name}
                      name={campo.name}
                      type="text"
                      value={form[campo.name]}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )
              )}

              <div>
                <label htmlFor="galeriaUrls" className="mb-1 block text-sm font-medium text-brand-text">
                  Galería (una URL por línea)
                </label>
                <textarea
                  id="galeriaUrls"
                  name="galeriaUrls"
                  rows={4}
                  value={form.galeriaUrls}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder={"https://...\nhttps://..."}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}
              {guardado && (
                <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  ¡Guardado! Ya se ve así en el mapa.
                </p>
              )}

              <button
                type="submit"
                disabled={guardando}
                className="rounded-lg bg-primary text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>

            <div>
              <p className="text-xs font-semibold text-brand-text/50 mb-2">Así se ve tu tarjeta en el mapa:</p>
              <div className="bg-white border border-secondary/40 rounded-xl p-3 sticky top-4">
                <PlaceCard lugar={lugar} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

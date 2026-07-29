"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { obtenerMiLugar, actualizarMiLugar, crearLugar, CATEGORIAS } from "@/lib/api";
import { obtenerToken, borrarToken } from "@/lib/auth";
import { normalizarUrlImagen } from "@/lib/imagenes";

const SelectorUbicacion = dynamic(() => import("@/components/SelectorUbicacion"), {
  ssr: false,
  loading: () => <p className="text-sm text-brand-text/50 animate-pulse">Cargando mapa...</p>,
});

const FORM_ALTA_VACIO = { nombre: "", descripcion: "", categoria: "GASTRONOMIA", ubicacion: null };

const CAMPOS_TEXTO = [
  { name: "descripcion", label: "Descripción", tipo: "textarea" },
  { name: "subcategoria", label: "Subcategoría (ej. Catedrales, Reservas naturales)", tipo: "input" },
  { name: "horarios", label: "Horarios", tipo: "input" },
  {
    name: "fotoUrl",
    label: "URL de la foto principal",
    tipo: "input",
    ayuda: "Pegá un link directo a la imagen (termina en .jpg, .png, etc.), no un link para compartir de Google Fotos. Los links de Drive o Dropbox se convierten automáticamente.",
  },
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
  const [formAlta, setFormAlta] = useState(FORM_ALTA_VACIO);
  const [creando, setCreando] = useState(false);
  const [errorAlta, setErrorAlta] = useState(null);

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

  function handleAltaChange(e) {
    const { name, value } = e.target;
    setFormAlta((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAltaSubmit(e) {
    e.preventDefault();
    setErrorAlta(null);

    if (!formAlta.nombre.trim() || formAlta.nombre.trim().length < 3) {
      setErrorAlta("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!formAlta.descripcion.trim() || formAlta.descripcion.trim().length < 10) {
      setErrorAlta("La descripción debe tener al menos 10 caracteres.");
      return;
    }
    if (!formAlta.ubicacion) {
      setErrorAlta("Tocá el mapa para marcar dónde está tu negocio.");
      return;
    }

    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    setCreando(true);
    try {
      const data = await crearLugar(token, {
        nombre: formAlta.nombre.trim(),
        descripcion: formAlta.descripcion.trim(),
        categoria: formAlta.categoria,
        latitud: formAlta.ubicacion.latitud,
        longitud: formAlta.ubicacion.longitud,
      });
      setLugar(data.lugar);
      setForm({ ...CAMPO_VACIO, descripcion: data.lugar.descripcion || "" });
      setEstado("listo");
    } catch (err) {
      setErrorAlta(err.message);
    } finally {
      setCreando(false);
    }
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
      if (!valor) continue;
      cambios[campo] = campo === "fotoUrl" ? normalizarUrlImagen(valor) : valor;
    }
    const galeria = form.galeriaUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .map(normalizarUrlImagen);
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
          <div className="w-full max-w-md">
            <h1 className="text-xl font-bold text-brand-text mb-1">Registrá tu lugar</h1>
            <p className="text-sm text-brand-text/60 mb-4">
              Tu lugar queda pendiente de revisión — el equipo de GeoKaia lo aprueba antes de que se vea en el mapa público.
            </p>

            <form onSubmit={handleAltaSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-brand-text">
                  Nombre del lugar
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formAlta.nombre}
                  onChange={handleAltaChange}
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Mi negocio"
                />
              </div>

              <div>
                <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-brand-text">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={3}
                  value={formAlta.descripcion}
                  onChange={handleAltaChange}
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Contale al turista qué va a encontrar"
                />
              </div>

              <div>
                <label htmlFor="categoria" className="mb-1 block text-sm font-medium text-brand-text">
                  Categoría
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formAlta.categoria}
                  onChange={handleAltaChange}
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {Object.entries(CATEGORIAS).map(([clave, cat]) => (
                    <option key={clave} value={clave}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-brand-text">Ubicación</label>
                <SelectorUbicacion
                  posicion={formAlta.ubicacion}
                  onSeleccionar={(ubicacion) => setFormAlta((prev) => ({ ...prev, ubicacion }))}
                />
              </div>

              {errorAlta && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorAlta}</p>
              )}

              <button
                type="submit"
                disabled={creando}
                className="rounded-lg bg-primary text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {creando ? "Enviando..." : "Registrar mi lugar"}
              </button>
            </form>
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

              {lugar.estado === "PENDIENTE" && (
                <p className="rounded-lg bg-secondary/20 px-3 py-2 text-sm text-brand-text">
                  🕒 Tu lugar está en revisión — todavía no se ve en el mapa público. Podés seguir editando mientras tanto.
                </p>
              )}
              {lugar.estado === "RECHAZADO" && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  Tu lugar no fue aprobado. Escribinos a geokaia404@gmail.com si tenés dudas.
                </p>
              )}

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
                    {campo.ayuda && (
                      <p className="mt-1 text-xs text-brand-text/50">{campo.ayuda}</p>
                    )}
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

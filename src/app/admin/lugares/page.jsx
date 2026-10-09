"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import {
  obtenerTodosLosLugares,
  actualizarLugarAdmin,
  eliminarLugarAdmin,
  CATEGORIAS,
} from "@/lib/api";
import { normalizarUrlImagen } from "@/lib/imagenes";
import { normalizarUrlPanorama } from "@/lib/panorama";

const SelectorUbicacion = dynamic(() => import("@/components/SelectorUbicacion"), {
  ssr: false,
  loading: () => <p className="text-sm text-brand-text/70 animate-pulse">Cargando mapa...</p>,
});

// Mismo criterio tolerante que panel-negocio: un link por línea, separados por coma o
// por punto y coma (o cualquier mezcla).
function parsearGaleriaUrls(texto) {
  return texto
    .split(/[\n,;]+/)
    .map((u) => u.trim())
    .filter(Boolean);
}

// A diferencia del panel de negocio, acá TODOS los campos están siempre disponibles
// sin importar el tier del lugar — el admin puede cargar cualquier cosa (pedido puntual
// para acelerar la carga de contenido real antes de la entrega).
const CAMPOS_TEXTO = [
  { name: "descripcion", label: "Descripción", tipo: "textarea" },
  { name: "subcategoria", label: "Subcategoría (ej. Catedrales, Reservas naturales)", tipo: "input" },
  { name: "horarios", label: "Horarios", tipo: "input" },
  { name: "fotoUrl", label: "URL de la foto principal", tipo: "input" },
  { name: "mapsUrl", label: "URL de Google Maps (opcional)", tipo: "input" },
  { name: "wazeUrl", label: "URL de Waze (opcional)", tipo: "input" },
  { name: "whatsapp", label: "WhatsApp (solo números, con código de país)", tipo: "input" },
  { name: "videoUrl", label: "URL del video (YouTube o TikTok)", tipo: "input" },
  { name: "panoramaUrl", label: "URL del visor 360° (recorrido virtual, video 360 de YouTube o foto 360)", tipo: "input" },
  { name: "menuUrl", label: "URL del menú digital o PDF", tipo: "input" },
  { name: "audioUrl", label: "URL de audio descriptivo (accesibilidad)", tipo: "input" },
];

const CAMPO_VACIO = {
  descripcion: "",
  subcategoria: "",
  horarios: "",
  mapsUrl: "",
  wazeUrl: "",
  fotoUrl: "",
  videoUrl: "",
  panoramaUrl: "",
  whatsapp: "",
  menuUrl: "",
  audioUrl: "",
  galeriaUrls: "",
};

const ESTADOS = ["PENDIENTE", "APROBADO", "RECHAZADO"];

function precargarForm(lugar) {
  return {
    ...CAMPO_VACIO,
    descripcion: lugar.descripcion || "",
    subcategoria: lugar.subcategoria || "",
    horarios: lugar.horarios || "",
    mapsUrl: lugar.mapsUrl || "",
    wazeUrl: lugar.wazeUrl || "",
    fotoUrl: lugar.fotoUrl || "",
    videoUrl: lugar.videoUrl || "",
    panoramaUrl: lugar.panoramaUrl || "",
    whatsapp: lugar.whatsapp || "",
    menuUrl: lugar.menuUrl || "",
    audioUrl: lugar.audioUrl || "",
    galeriaUrls: (lugar.galeriaUrls || []).join("\n"),
  };
}

export default function AdminLugaresPage() {
  const router = useRouter();
  const [estado, setEstado] = useState("cargando"); // cargando | sin-token | sin-permiso | listo | error
  const [lugares, setLugares] = useState([]);
  const [error, setError] = useState(null);

  const [editandoId, setEditandoId] = useState(null);
  const [formUbicacion, setFormUbicacion] = useState({ nombre: "", categoria: "GASTRONOMIA", estadoLugar: "APROBADO", ubicacion: null });
  const [form, setForm] = useState(CAMPO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  const [borrandoId, setBorrandoId] = useState(null); // id con el modal de confirmación abierto
  const [eliminando, setEliminando] = useState(false);
  const [errorBorrar, setErrorBorrar] = useState(null);

  function cargar() {
    obtenerTodosLosLugares()
      .then((data) => {
        setLugares(data);
        setEstado("listo");
      })
      .catch((err) => {
        if (err.tipo === "sesion") {
          setEstado("sin-token");
        } else if (err.message.includes("administrador")) {
          setEstado("sin-permiso");
        } else {
          setError(err.message);
          setEstado("error");
        }
      });
  }

  useEffect(cargar, []);

  function abrirEdicion(lugar) {
    setEditandoId(lugar.id);
    setFormUbicacion({
      nombre: lugar.nombre || "",
      categoria: lugar.categoria || "GASTRONOMIA",
      estadoLugar: lugar.estado || "APROBADO",
      ubicacion: { latitud: lugar.latitud, longitud: lugar.longitud },
    });
    setForm(precargarForm(lugar));
    setGuardado(false);
    setErrorGuardar(null);
  }

  function cerrarEdicion() {
    setEditandoId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setGuardado(false);
  }

  function handleUbicacionChange(e) {
    const { name, value } = e.target;
    setFormUbicacion((prev) => ({ ...prev, [name]: value }));
    setGuardado(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formUbicacion.nombre.trim() || formUbicacion.nombre.trim().length < 3) {
      setErrorGuardar("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!formUbicacion.ubicacion) {
      setErrorGuardar("Marcá la ubicación en el mapa.");
      return;
    }

    const cambios = {
      nombre: formUbicacion.nombre.trim(),
      categoria: formUbicacion.categoria,
      estado: formUbicacion.estadoLugar,
      latitud: formUbicacion.ubicacion.latitud,
      longitud: formUbicacion.ubicacion.longitud,
    };
    for (const campo of Object.keys(CAMPO_VACIO)) {
      if (campo === "galeriaUrls") continue;
      const valor = form[campo].trim();
      if (!valor) continue;
      cambios[campo] =
        campo === "fotoUrl" ? normalizarUrlImagen(valor) : campo === "panoramaUrl" ? normalizarUrlPanorama(valor) : valor;
    }
    const galeria = parsearGaleriaUrls(form.galeriaUrls).slice(0, 5).map(normalizarUrlImagen);
    if (galeria.length > 0) cambios.galeriaUrls = galeria;

    setGuardando(true);
    setErrorGuardar(null);
    try {
      const data = await actualizarLugarAdmin(editandoId, cambios);
      setLugares((prev) => prev.map((l) => (l.id === editandoId ? { ...l, ...data.lugar } : l)));
      setGuardado(true);
    } catch (err) {
      setErrorGuardar(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleBorrar() {
    setEliminando(true);
    setErrorBorrar(null);
    try {
      await eliminarLugarAdmin(borrandoId);
      setLugares((prev) => prev.filter((l) => l.id !== borrandoId));
      setBorrandoId(null);
      if (editandoId === borrandoId) setEditandoId(null);
    } catch (err) {
      setErrorBorrar(err.message);
    } finally {
      setEliminando(false);
    }
  }

  const lugarEditando = lugares.find((l) => l.id === editandoId);

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">

      <main id="contenido" className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-3xl">
          {!lugarEditando && (
            <>
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-xl font-bold text-brand-text">Todos los lugares</h1>
                <Link href="/admin" className="text-sm text-accent-fg hover:underline">
                  ← Cola de aprobación
                </Link>
              </div>
              <p className="text-sm text-brand-text/70 mb-1">
                Ver, editar y borrar cualquier lugar sin pasar por la cuenta del negocio dueño — útil para corregir
                pines o cargar contenido rápido antes de la entrega.
              </p>
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-6">
                Esto omite el modelo normal de permisos (cada negocio administra lo suyo). Es un atajo puntual, no
                el flujo pensado para producción.
              </p>
            </>
          )}

          {estado === "cargando" && <p className="text-brand-text/70 animate-pulse">Cargando...</p>}

          {estado === "sin-token" && (
            <div>
              <p className="text-brand-text/80 mb-4">Necesitás iniciar sesión como administrador.</p>
              <button
                onClick={() => router.push("/admin/login")}
                className="rounded-lg bg-accent-dark text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
              >
                Iniciar sesión
              </button>
            </div>
          )}

          {estado === "sin-permiso" && (
            <p className="text-brand-text/80">Tu cuenta no tiene permisos de administrador.</p>
          )}

          {estado === "error" && <p className="text-red-600 text-sm">{error}</p>}

          {estado === "listo" && !lugarEditando && (
            <div className="flex flex-col gap-4">
              {lugares.length === 0 && (
                <p className="text-brand-text/70">Todavía no hay lugares cargados.</p>
              )}
              {lugares.map((lugar) => (
                <div key={lugar.id} className="bg-surface border border-secondary/40 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <PlaceCard lugar={lugar} />
                    <p className="text-xs text-brand-text/70 mt-2">
                      Estado: <strong>{lugar.estado}</strong>
                      {lugar.negocio && (
                        <> · Negocio: {lugar.negocio.nombreContacto} · {lugar.negocio.email} · {lugar.negocio.whatsapp}</>
                      )}
                      {!lugar.negocio && <> · Sin negocio dueño (cargado directamente)</>}
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => abrirEdicion(lugar)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary text-white text-sm font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => { setBorrandoId(lugar.id); setErrorBorrar(null); }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-red-300 text-red-700 text-sm font-semibold px-4 py-2 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {estado === "listo" && lugarEditando && (
            <div>
              <button
                type="button"
                onClick={cerrarEdicion}
                className="flex items-center gap-1.5 text-sm text-brand-text/70 hover:text-brand-text mb-4"
              >
                <ArrowLeft size={16} /> Volver al listado
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h1 className="text-xl font-bold text-brand-text">{lugarEditando.nombre}</h1>

                  <div>
                    <label htmlFor="nombreLugar" className="mb-1 block text-sm font-medium text-brand-text">
                      Nombre del lugar
                    </label>
                    <input
                      id="nombreLugar"
                      name="nombre"
                      type="text"
                      value={formUbicacion.nombre}
                      onChange={handleUbicacionChange}
                      className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label htmlFor="categoriaLugar" className="mb-1 block text-sm font-medium text-brand-text">
                        Categoría
                      </label>
                      <select
                        id="categoriaLugar"
                        name="categoria"
                        value={formUbicacion.categoria}
                        onChange={handleUbicacionChange}
                        className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        {Object.entries(CATEGORIAS).map(([clave, cat]) => (
                          <option key={clave} value={clave}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="estadoLugar" className="mb-1 block text-sm font-medium text-brand-text">
                        Estado
                      </label>
                      <select
                        id="estadoLugar"
                        name="estadoLugar"
                        value={formUbicacion.estadoLugar}
                        onChange={handleUbicacionChange}
                        className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-brand-text">
                      Ubicación (tocá el mapa para reposicionar el pin)
                    </label>
                    <SelectorUbicacion
                      posicion={formUbicacion.ubicacion}
                      onSeleccionar={(ubicacion) => {
                        setFormUbicacion((prev) => ({ ...prev, ubicacion }));
                        setGuardado(false);
                      }}
                    />
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

                  {(() => {
                    const urlsGaleria = parsearGaleriaUrls(form.galeriaUrls);
                    const excedeLimite = urlsGaleria.length > 5;
                    return (
                      <div>
                        <label htmlFor="galeriaUrls" className="mb-1 block text-sm font-medium text-brand-text">
                          Galería (hasta 5 fotos)
                        </label>
                        <textarea
                          id="galeriaUrls"
                          name="galeriaUrls"
                          rows={4}
                          value={form.galeriaUrls}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder={"Pegá los links de las fotos, uno por línea o separados por coma:\nhttps://...\nhttps://..."}
                        />
                        <p className={`mt-1 text-xs ${excedeLimite ? "text-red-600" : "text-brand-text/70"}`}>
                          {Math.min(urlsGaleria.length, 5)}/5 fotos
                          {excedeLimite && " — se van a guardar solo las primeras 5"}
                        </p>
                      </div>
                    );
                  })()}

                  {errorGuardar && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorGuardar}</p>
                  )}
                  {guardado && (
                    <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">¡Guardado!</p>
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
                  <p className="text-xs font-semibold text-brand-text/70 mb-2">Así se ve la tarjeta en el mapa:</p>
                  <div className="bg-surface border border-secondary/40 rounded-xl p-3 sticky top-4">
                    <PlaceCard lugar={lugarEditando} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {borrandoId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-surface p-5">
            <h2 className="text-lg font-bold text-brand-text mb-1">Borrar este lugar</h2>
            <p className="text-sm text-brand-text/70 mb-4">
              Esta acción es permanente: el lugar desaparece del mapa y de cualquier ruta que lo incluya como parada.
            </p>

            {errorBorrar && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 mb-3">{errorBorrar}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBorrandoId(null)}
                disabled={eliminando}
                className="flex-1 rounded-lg border border-secondary/50 text-brand-text font-medium px-4 py-2.5 hover:bg-brand-bg transition-colors disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleBorrar}
                disabled={eliminando}
                className="flex-1 rounded-lg bg-red-600 text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {eliminando ? "Borrando..." : "Borrar lugar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

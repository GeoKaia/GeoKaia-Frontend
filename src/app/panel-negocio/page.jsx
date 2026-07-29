"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import CampoContrasena from "@/components/CampoContrasena";
import { obtenerMiLugar, actualizarMiLugar, crearLugar, eliminarMiLugar, CATEGORIAS } from "@/lib/api";
import { obtenerToken, borrarToken } from "@/lib/auth";
import { normalizarUrlImagen } from "@/lib/imagenes";

const SelectorUbicacion = dynamic(() => import("@/components/SelectorUbicacion"), {
  ssr: false,
  loading: () => <p className="text-sm text-brand-text/50 animate-pulse">Cargando mapa...</p>,
});

const PRECIO_PREMIUM = "9.99";

const BULLETS_GRATIS = [
  "Nombre del lugar",
  "Descripción",
  "Categoría",
  "Horarios de atención",
  "Foto principal (URL)",
  "WhatsApp de contacto",
  "Tu pin en el mapa (Waze y Google Maps se generan solos)",
];

const BULLETS_PREMIUM = [
  "Todo lo del plan Gratuito, más:",
  "Foto 360° (visor Pannellum)",
  "Video de YouTube o TikTok",
  "Galería de hasta 5 fotos adicionales",
  "Menú digital o PDF",
  "Audio descriptivo (accesibilidad)",
];

const DATOS_TARJETA_VACIO = { numero: "", vencimiento: "", cvv: "", nombre: "" };

const FORM_ALTA_VACIO = { nombre: "", descripcion: "", categoria: "GASTRONOMIA", ubicacion: null };

const CAMPOS_TEXTO = [
  { name: "descripcion", label: "Descripción", tipo: "textarea", tier: "AMBOS" },
  { name: "subcategoria", label: "Subcategoría (ej. Catedrales, Reservas naturales)", tipo: "input", tier: "AMBOS" },
  { name: "horarios", label: "Horarios", tipo: "input", tier: "AMBOS" },
  {
    name: "fotoUrl",
    label: "URL de la foto principal",
    tipo: "input",
    tier: "AMBOS",
    ayuda: "Pegá un link directo a la imagen (termina en .jpg, .png, etc.), no un link para compartir de Google Fotos. Los links de Drive o Dropbox se convierten automáticamente.",
  },
  { name: "whatsapp", label: "WhatsApp (solo números, con código de país)", tipo: "input", tier: "AMBOS" },
  { name: "videoUrl", label: "URL del video (YouTube o TikTok)", tipo: "input", tier: "PREMIUM" },
  { name: "panoramaUrl", label: "URL del visor 360°", tipo: "input", tier: "PREMIUM" },
  { name: "menuUrl", label: "URL del menú digital o PDF", tipo: "input", tier: "PREMIUM" },
  { name: "audioUrl", label: "URL de audio descriptivo (accesibilidad)", tipo: "input", tier: "PREMIUM" },
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
  audioUrl: "",
  galeriaUrls: "",
};

export default function PanelNegocioPage() {
  const router = useRouter();
  const [estado, setEstado] = useState("cargando"); // cargando | sin-token | sin-lugar | listo | error
  const [lugar, setLugar] = useState(null);
  const [form, setForm] = useState(CAMPO_VACIO);
  const [formUbicacion, setFormUbicacion] = useState({ nombre: "", categoria: "GASTRONOMIA", ubicacion: null });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [guardado, setGuardado] = useState(false);

  // Alta de lugar: elegir plan -> (si es premium) mock de pago -> formulario de alta
  const [pasoSinLugar, setPasoSinLugar] = useState("elegir-plan"); // elegir-plan | pago-mock | alta
  const [tierElegido, setTierElegido] = useState(null);
  const [datosTarjeta, setDatosTarjeta] = useState(DATOS_TARJETA_VACIO);
  const [pagoMostrarAviso, setPagoMostrarAviso] = useState(false);
  const [formAlta, setFormAlta] = useState(FORM_ALTA_VACIO);
  const [creando, setCreando] = useState(false);
  const [errorAlta, setErrorAlta] = useState(null);

  // Borrar mi negocio (mantiene la cuenta, solo borra el lugar)
  const [mostrarModalBorrar, setMostrarModalBorrar] = useState(false);
  const [passwordBorrar, setPasswordBorrar] = useState("");
  const [borrandoLugar, setBorrandoLugar] = useState(false);
  const [errorBorrarLugar, setErrorBorrarLugar] = useState(null);

  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    obtenerMiLugar(token)
      .then((data) => {
        setLugar(data);
        setFormUbicacion({
          nombre: data.nombre || "",
          categoria: data.categoria || "GASTRONOMIA",
          ubicacion: { latitud: data.latitud, longitud: data.longitud },
        });
        setForm({
          descripcion: data.descripcion || "",
          subcategoria: data.subcategoria || "",
          horarios: data.horarios || "",
          fotoUrl: data.fotoUrl || "",
          videoUrl: data.videoUrl || "",
          panoramaUrl: data.panoramaUrl || "",
          whatsapp: data.whatsapp || "",
          menuUrl: data.menuUrl || "",
          audioUrl: data.audioUrl || "",
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

  function elegirGratis() {
    setTierElegido("GRATIS");
    setPasoSinLugar("alta");
  }

  function elegirPremium() {
    setPasoSinLugar("pago-mock");
  }

  function volverAElegirPlan() {
    setPagoMostrarAviso(false);
    setDatosTarjeta(DATOS_TARJETA_VACIO);
    setPasoSinLugar("elegir-plan");
  }

  function confirmarPagoMock() {
    setTierElegido("PREMIUM");
    setPasoSinLugar("alta");
  }

  function cambiarPlan() {
    setPasoSinLugar("elegir-plan");
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
        tier: tierElegido || "GRATIS",
      });
      setLugar(data.lugar);
      setFormUbicacion({
        nombre: data.lugar.nombre || "",
        categoria: data.lugar.categoria || "GASTRONOMIA",
        ubicacion: { latitud: data.lugar.latitud, longitud: data.lugar.longitud },
      });
      setForm({ ...CAMPO_VACIO, descripcion: data.lugar.descripcion || "" });
      setEstado("listo");
    } catch (err) {
      setErrorAlta(err.message);
    } finally {
      setCreando(false);
    }
  }

  function handleUbicacionChange(e) {
    const { name, value } = e.target;
    setFormUbicacion((prev) => ({ ...prev, [name]: value }));
    setGuardado(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    if (!formUbicacion.nombre.trim() || formUbicacion.nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!formUbicacion.ubicacion) {
      setError("Tocá el mapa para marcar dónde está tu negocio.");
      return;
    }

    // Solo mandamos campos con contenido: el backend rechaza URLs vacías como invalidas.
    const cambios = {
      nombre: formUbicacion.nombre.trim(),
      categoria: formUbicacion.categoria,
      latitud: formUbicacion.ubicacion.latitud,
      longitud: formUbicacion.ubicacion.longitud,
    };
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

  function abrirModalBorrarLugar() {
    setPasswordBorrar("");
    setErrorBorrarLugar(null);
    setMostrarModalBorrar(true);
  }

  function cerrarModalBorrarLugar() {
    if (borrandoLugar) return;
    setMostrarModalBorrar(false);
  }

  async function handleBorrarLugar(e) {
    e.preventDefault();
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    setBorrandoLugar(true);
    setErrorBorrarLugar(null);
    try {
      await eliminarMiLugar(token, passwordBorrar);
      setMostrarModalBorrar(false);
      setLugar(null);
      setForm(CAMPO_VACIO);
      setTierElegido(null);
      setPasoSinLugar("elegir-plan");
      setPagoMostrarAviso(false);
      setDatosTarjeta(DATOS_TARJETA_VACIO);
      setEstado("sin-lugar");
    } catch (err) {
      setErrorBorrarLugar(err.message);
    } finally {
      setBorrandoLugar(false);
    }
  }

  const esPremium = lugar?.tier === "PREMIUM";

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

        {estado === "sin-lugar" && pasoSinLugar === "elegir-plan" && (
          <div className="w-full max-w-2xl">
            <h1 className="text-xl font-bold text-brand-text mb-1">Elegí tu plan</h1>
            <p className="text-sm text-brand-text/60 mb-4">
              Podés registrar tu lugar gratis o sumar más funciones con Premium.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-secondary/40 bg-white p-5 flex flex-col">
                <h2 className="font-bold text-brand-text mb-1">Gratuito</h2>
                <p className="text-2xl font-bold text-brand-text mb-3">$0</p>
                <ul className="text-sm text-brand-text/70 flex-1 flex flex-col gap-1.5 mb-4">
                  {BULLETS_GRATIS.map((b) => (
                    <li key={b}>✓ {b}</li>
                  ))}
                </ul>
                <button
                  onClick={elegirGratis}
                  className="rounded-lg bg-primary text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
                >
                  Elegir Gratuito
                </button>
              </div>

              <div className="rounded-xl border-2 border-accent bg-white p-5 flex flex-col">
                <h2 className="font-bold text-brand-text mb-1">⭐ Premium</h2>
                <p className="text-2xl font-bold text-brand-text mb-3">
                  ${PRECIO_PREMIUM}
                  <span className="text-sm font-normal text-brand-text/60">/mes</span>
                </p>
                <ul className="text-sm text-brand-text/70 flex-1 flex flex-col gap-1.5 mb-4">
                  {BULLETS_PREMIUM.map((b) => (
                    <li key={b}>✓ {b}</li>
                  ))}
                </ul>
                <button
                  onClick={elegirPremium}
                  className="rounded-lg bg-accent text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
                >
                  Elegir Premium
                </button>
              </div>
            </div>
          </div>
        )}

        {estado === "sin-lugar" && pasoSinLugar === "pago-mock" && (
          <div className="w-full max-w-sm">
            <h1 className="text-xl font-bold text-brand-text mb-1">Suscripción Premium</h1>
            <p className="text-sm text-brand-text/60 mb-4">${PRECIO_PREMIUM}/mes</p>

            <div className="rounded-xl border border-secondary/40 bg-white p-5 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-text">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={datosTarjeta.numero}
                  onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, numero: e.target.value }))}
                  disabled={pagoMostrarAviso}
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-brand-text">Vencimiento</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={datosTarjeta.vencimiento}
                    onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, vencimiento: e.target.value }))}
                    disabled={pagoMostrarAviso}
                    className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-brand-text">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={datosTarjeta.cvv}
                    onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, cvv: e.target.value }))}
                    disabled={pagoMostrarAviso}
                    className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-text">Nombre en la tarjeta</label>
                <input
                  type="text"
                  placeholder="Como aparece en la tarjeta"
                  value={datosTarjeta.nombre}
                  onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, nombre: e.target.value }))}
                  disabled={pagoMostrarAviso}
                  className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>

              {!pagoMostrarAviso ? (
                <button
                  onClick={() => setPagoMostrarAviso(true)}
                  className="rounded-lg bg-accent text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
                >
                  Pagar ${PRECIO_PREMIUM}/mes
                </button>
              ) : (
                <>
                  <p className="rounded-lg bg-secondary/20 px-3 py-2 text-sm text-brand-text">
                    💳 Los pagos en línea todavía son una función próxima — mientras tanto activamos tu plan
                    Premium sin cargo para que puedas probarlo.
                  </p>
                  <button
                    onClick={confirmarPagoMock}
                    className="rounded-lg bg-primary text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
                  >
                    Continuar
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={volverAElegirPlan}
                className="text-sm text-brand-text/60 underline self-start"
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {estado === "sin-lugar" && pasoSinLugar === "alta" && (
          <div className="w-full max-w-md">
            <h1 className="text-xl font-bold text-brand-text mb-1">Registrá tu lugar</h1>
            <p className="text-sm text-brand-text/60 mb-1">
              Tu lugar queda pendiente de revisión — el equipo de GeoKaia lo aprueba antes de que se vea en el mapa público.
            </p>
            <p className="text-sm text-brand-text/60 mb-4">
              Plan elegido: <strong>{tierElegido === "PREMIUM" ? `Premium · $${PRECIO_PREMIUM}/mes` : "Gratuito"}</strong>
              {" — "}
              <button type="button" onClick={cambiarPlan} className="underline">
                Cambiar plan
              </button>
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
          <>
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h1 className="text-xl font-bold text-brand-text">{lugar.nombre}</h1>
                  <p className="text-xs font-semibold text-accent-dark mt-0.5">
                    {esPremium ? `⭐ Plan Premium · $${PRECIO_PREMIUM}/mes` : "Plan Gratuito"}
                  </p>
                  <p className="text-xs text-brand-text/50 mt-1">Editá el contenido de tu lugar en GeoKaia</p>
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

                <div>
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
                      <option key={clave} value={clave}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text">Ubicación</label>
                  <SelectorUbicacion
                    posicion={formUbicacion.ubicacion}
                    onSeleccionar={(ubicacion) => {
                      setFormUbicacion((prev) => ({ ...prev, ubicacion }));
                      setGuardado(false);
                    }}
                  />
                </div>

                {CAMPOS_TEXTO.filter((campo) => campo.tier === "AMBOS" || esPremium).map((campo) =>
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

                {esPremium && (
                  <div>
                    <label htmlFor="galeriaUrls" className="mb-1 block text-sm font-medium text-brand-text">
                      Galería (hasta 5 URLs, una por línea)
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
                )}

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

            <div className="w-full max-w-3xl rounded-xl border border-red-200 bg-white p-4">
              <p className="text-sm font-semibold text-red-700 mb-1">Zona de peligro</p>
              <p className="text-sm text-brand-text/60 mb-3">
                Esto borra tu lugar del mapa de GeoKaia. Tu cuenta sigue activa y podés registrar un lugar nuevo después.
              </p>
              <button
                onClick={abrirModalBorrarLugar}
                className="rounded-lg border border-red-300 text-red-700 font-medium px-4 py-2 text-sm hover:bg-red-50 transition-colors"
              >
                Borrar mi negocio
              </button>
            </div>
          </>
        )}
      </main>

      {mostrarModalBorrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5">
            <h2 className="text-lg font-bold text-brand-text mb-1">Borrar tu negocio</h2>
            <p className="text-sm text-brand-text/70 mb-4">
              Esta acción es permanente: tu lugar desaparece del mapa de GeoKaia. Tu cuenta de acceso sigue
              activa. Confirmá tu contraseña para continuar.
            </p>

            <form onSubmit={handleBorrarLugar} className="flex flex-col gap-3">
              <div>
                <label htmlFor="passwordLugar" className="mb-1 block text-sm font-medium text-brand-text">
                  Contraseña
                </label>
                <CampoContrasena
                  id="passwordLugar"
                  name="passwordLugar"
                  autoComplete="current-password"
                  value={passwordBorrar}
                  onChange={(e) => setPasswordBorrar(e.target.value)}
                />
              </div>

              {errorBorrarLugar && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorBorrarLugar}</p>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={cerrarModalBorrarLugar}
                  disabled={borrandoLugar}
                  className="flex-1 rounded-lg border border-secondary/50 text-brand-text font-medium px-4 py-2.5 hover:bg-brand-bg transition-colors disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={borrandoLugar || !passwordBorrar}
                  className="flex-1 rounded-lg bg-red-600 text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {borrandoLugar ? "Borrando..." : "Borrar negocio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  obtenerLugaresPendientes,
  obtenerLugares,
  obtenerRutas,
  crearRuta,
  actualizarRuta,
  eliminarRuta,
} from "@/lib/api";
import { obtenerToken } from "@/lib/auth";
import { PALETA_EXTENDIDA } from "@/lib/colores";

const FORM_VACIO = {
  nombre: "",
  categoria: "",
  descripcion: "",
  descripcionParaIA: "",
  fotoUrl: "",
  emoji: "🗺️",
  color: PALETA_EXTENDIDA[0],
};

export default function AdminRutasPage() {
  const router = useRouter();
  const [estado, setEstado] = useState("cargando"); // cargando | sin-token | sin-permiso | listo | error
  const [error, setError] = useState(null);

  const [lugares, setLugares] = useState([]);
  const [rutas, setRutas] = useState([]);

  const [form, setForm] = useState(FORM_VACIO);
  const [paradas, setParadas] = useState([]); // [{ lugarId, minutosAlSiguiente, distanciaKm }]
  const [lugarAAgregar, setLugarAAgregar] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);
  const [borrandoId, setBorrandoId] = useState(null); // confirmación de un click antes de borrar

  function cargar() {
    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    obtenerLugaresPendientes(token)
      .then(() => Promise.all([obtenerLugares(), obtenerRutas()]))
      .then(([lugaresData, rutasData]) => {
        setLugares(lugaresData);
        setRutas(rutasData);
        setEstado("listo");
      })
      .catch((err) => {
        if (err.message.includes("administrador")) {
          setEstado("sin-permiso");
        } else {
          setError(err.message);
          setEstado("error");
        }
      });
  }

  useEffect(cargar, []);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function agregarLugar() {
    if (!lugarAAgregar) return;
    const lugarId = Number(lugarAAgregar);
    if (paradas.some((p) => p.lugarId === lugarId)) return;
    setParadas((prev) => [...prev, { lugarId, minutosAlSiguiente: "", distanciaKm: "" }]);
    setLugarAAgregar("");
  }

  function quitarParada(index) {
    setParadas((prev) => prev.filter((_, i) => i !== index));
  }

  function moverParada(index, direccion) {
    setParadas((prev) => {
      const nuevo = [...prev];
      const destino = index + direccion;
      if (destino < 0 || destino >= nuevo.length) return prev;
      [nuevo[index], nuevo[destino]] = [nuevo[destino], nuevo[index]];
      return nuevo;
    });
  }

  function handleParadaCampoChange(index, campo, valor) {
    setParadas((prev) => prev.map((p, i) => (i === index ? { ...p, [campo]: valor } : p)));
  }

  function empezarEdicion(ruta) {
    setEditandoId(ruta.id);
    setForm({
      nombre: ruta.nombre,
      categoria: ruta.categoria || "",
      descripcion: ruta.descripcion,
      descripcionParaIA: ruta.descripcionParaIA,
      fotoUrl: ruta.fotoUrl || "",
      emoji: ruta.emoji || "🗺️",
      color: ruta.color || PALETA_EXTENDIDA[0],
    });
    setParadas(
      ruta.paradas.map((p) => ({
        lugarId: p.lugarId,
        minutosAlSiguiente: p.minutosAlSiguiente ?? "",
        distanciaKm: p.distanciaKm ?? "",
      }))
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setParadas([]);
    setErrorForm(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorForm(null);

    if (paradas.length === 0) {
      setErrorForm("Agregá al menos un lugar a la ruta.");
      return;
    }

    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    const payload = {
      ...form,
      fotoUrl: form.fotoUrl.trim() || undefined,
      paradas: paradas.map((p, i) => ({
        lugarId: p.lugarId,
        orden: i,
        minutosAlSiguiente: p.minutosAlSiguiente === "" ? null : Number(p.minutosAlSiguiente),
        distanciaKm: p.distanciaKm === "" ? null : Number(p.distanciaKm),
      })),
    };

    setGuardando(true);
    try {
      if (editandoId) {
        const data = await actualizarRuta(token, editandoId, payload);
        setRutas((prev) => prev.map((r) => (r.id === editandoId ? data.ruta : r)));
      } else {
        const data = await crearRuta(token, payload);
        setRutas((prev) => [...prev, data.ruta]);
      }
      cancelarEdicion();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleBorrar(id) {
    if (borrandoId !== id) {
      setBorrandoId(id);
      return;
    }

    const token = obtenerToken();
    if (!token) {
      setEstado("sin-token");
      return;
    }

    try {
      await eliminarRuta(token, id);
      setRutas((prev) => prev.filter((r) => r.id !== id));
      if (editandoId === id) cancelarEdicion();
    } catch (err) {
      setError(err.message);
    } finally {
      setBorrandoId(null);
    }
  }

  function nombreLugar(lugarId) {
    return lugares.find((l) => l.id === lugarId)?.nombre || `Lugar #${lugarId}`;
  }

  const lugaresDisponibles = lugares.filter((l) => !paradas.some((p) => p.lugarId === l.id));

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-brand-text">Rutas</h1>
            <Link href="/admin" className="text-sm text-accent-dark hover:underline">
              ← Cola de aprobación
            </Link>
          </div>
          <p className="text-sm text-brand-text/60 mb-6">
            Armá rutas temáticas eligiendo entre los lugares ya aprobados.
          </p>

          {estado === "cargando" && (
            <p className="text-brand-text/60 animate-pulse">Cargando...</p>
          )}

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

          {estado === "listo" && (
            <div className="flex flex-col gap-8">
              <form onSubmit={handleSubmit} className="bg-white border border-secondary/40 rounded-xl p-5 flex flex-col gap-4">
                <h2 className="font-bold text-brand-text">
                  {editandoId ? "Editar ruta" : "Nueva ruta"}
                </h2>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text">Título</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Ruta del Café"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text">Categoría</label>
                  <input
                    name="categoria"
                    value={form.categoria}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Ej. Gastronomía, Naturaleza"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows={2}
                    value={form.descripcion}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Lo que ve el turista en la tarjeta de la ruta"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text">
                    Descripción para la IA
                  </label>
                  <textarea
                    name="descripcionParaIA"
                    rows={2}
                    value={form.descripcionParaIA}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Contexto que usa Kaia para recomendar esta ruta en el chat"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text">URL de la foto</label>
                  <input
                    name="fotoUrl"
                    value={form.fotoUrl}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-24">
                    <label className="mb-1 block text-sm font-medium text-brand-text">Emoji</label>
                    <input
                      name="emoji"
                      value={form.emoji}
                      onChange={handleFormChange}
                      maxLength={4}
                      className="w-full rounded-lg border border-secondary/50 px-3 py-2 text-center text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-brand-text">Color de la tarjeta</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {PALETA_EXTENDIDA.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                          aria-label={`Elegir color ${c}`}
                          className="w-7 h-7 rounded-full border-2"
                          style={{
                            backgroundColor: c,
                            borderColor: form.color === c ? "var(--color-brand-text)" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-secondary/30 pt-4">
                  <label className="mb-2 block text-sm font-medium text-brand-text">
                    Lugares de la ruta (solo lugares aprobados)
                  </label>

                  <div className="flex gap-2 mb-3">
                    <select
                      value={lugarAAgregar}
                      onChange={(e) => setLugarAAgregar(e.target.value)}
                      className="flex-1 rounded-lg border border-secondary/50 px-3 py-2 text-sm text-brand-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="">
                        {lugaresDisponibles.length === 0 ? "No hay más lugares aprobados" : "Elegir un lugar..."}
                      </option>
                      {lugaresDisponibles.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nombre}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={agregarLugar}
                      disabled={!lugarAAgregar}
                      className="rounded-lg bg-secondary/40 text-brand-text text-sm font-semibold px-4 py-2 hover:bg-secondary/60 transition-colors disabled:opacity-50"
                    >
                      Agregar
                    </button>
                  </div>

                  {paradas.length === 0 && (
                    <p className="text-sm text-brand-text/50">Todavía no agregaste ningún lugar.</p>
                  )}

                  <div className="flex flex-col gap-2">
                    {paradas.map((p, i) => (
                      <div key={p.lugarId} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-brand-bg border border-secondary/30 rounded-lg px-3 py-2">
                          <span className="text-xs font-semibold text-brand-text/50 w-5">{i + 1}.</span>
                          <span className="flex-1 text-sm text-brand-text">{nombreLugar(p.lugarId)}</span>
                          <button
                            type="button"
                            onClick={() => moverParada(i, -1)}
                            disabled={i === 0}
                            aria-label="Subir"
                            className="text-brand-text/50 hover:text-brand-text disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moverParada(i, 1)}
                            disabled={i === paradas.length - 1}
                            aria-label="Bajar"
                            className="text-brand-text/50 hover:text-brand-text disabled:opacity-30"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => quitarParada(i)}
                            aria-label="Quitar"
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>

                        {i < paradas.length - 1 && (
                          <div className="flex items-center gap-2 pl-7 text-xs text-brand-text/60">
                            <span>↓ hasta el siguiente:</span>
                            <input
                              type="number"
                              min="0"
                              value={p.minutosAlSiguiente}
                              onChange={(e) => handleParadaCampoChange(i, "minutosAlSiguiente", e.target.value)}
                              placeholder="min"
                              className="w-16 rounded border border-secondary/50 px-2 py-1 text-xs"
                            />
                            <span>min ·</span>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={p.distanciaKm}
                              onChange={(e) => handleParadaCampoChange(i, "distanciaKm", e.target.value)}
                              placeholder="km"
                              className="w-16 rounded border border-secondary/50 px-2 py-1 text-xs"
                            />
                            <span>km</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {errorForm && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorForm}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="rounded-lg bg-primary text-white font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear ruta"}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      onClick={cancelarEdicion}
                      className="rounded-lg border border-secondary/50 text-brand-text font-medium px-4 py-2.5 hover:bg-brand-bg transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              <div>
                <h2 className="font-bold text-brand-text mb-3">Rutas existentes</h2>
                {rutas.length === 0 && (
                  <p className="text-sm text-brand-text/50">Todavía no hay ninguna ruta creada.</p>
                )}
                <div className="flex flex-col gap-2">
                  {rutas.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-3 bg-white border border-secondary/40 rounded-xl px-4 py-3"
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                        style={{ backgroundColor: r.color || "#10546F" }}
                      >
                        {r.emoji || "🗺️"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brand-text truncate">{r.nombre}</p>
                        <p className="text-xs text-brand-text/50">
                          {r.paradas.length} {r.paradas.length === 1 ? "parada" : "paradas"}
                        </p>
                      </div>
                      <button
                        onClick={() => empezarEdicion(r)}
                        className="text-xs font-semibold text-accent-dark hover:underline shrink-0"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleBorrar(r.id)}
                        className="text-xs font-semibold text-red-600 hover:underline shrink-0"
                      >
                        {borrandoId === r.id ? "¿Confirmar?" : "Borrar"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

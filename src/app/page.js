"use client"; 

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Importación dinámica apagando el SSR para evitar el error 'window is undefined' de Leaflet
const MapaBase = dynamic(() => import('@/components/MapaBase'), {
  ssr: false,
  loading: () => <p className="p-4 text-center text-gray-500 animate-pulse">Cargando mapa interactivo...</p>
});

export default function Home() {
  const [mensaje, setMensaje] = useState('Cargando conexión con el backend...');

  useEffect(() => {
    // Ping a la ruta base del backend (actualizado a producción)
    fetch('https://geokaia-backend.onrender.com/')
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje))
      .catch(() => setMensaje('Error conectando al backend ❌. ¿Está encendido?'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <header className="mb-8 w-full max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          GeoKaia Frontend 🌿
        </h1>
        <p className="text-lg text-gray-700 bg-white px-6 py-3 rounded-lg shadow-sm inline-block">
          Estado del servidor: <span className="font-semibold">{mensaje}</span>
        </p>
      </header>

      {/* Contenedor del Mapa */}
      <section className="w-full max-w-5xl mx-auto bg-white p-2 rounded-xl shadow-md border border-gray-100">
        <MapaBase />
      </section>
    </main>
  );
}
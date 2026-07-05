"use client"; // Necesario en Next.js para usar hooks como useEffect

import { useEffect, useState } from 'react';

export default function Home() {
  const [mensaje, setMensaje] = useState('Cargando conexión con el backend...');

  useEffect(() => {
    // Hacemos ping a la ruta base de tu backend que configuraste en index.js
    fetch('http://localhost:4000/')
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje))
      .catch(() => setMensaje('Error conectando al backend ❌. ¿Está encendido?'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        GeoKaia Frontend 🌿
      </h1>
      <p className="text-xl text-gray-700 bg-white p-6 rounded-lg shadow-md">
        Estado del servidor: <span className="font-semibold">{mensaje}</span>
      </p>
    </main>
  );
}
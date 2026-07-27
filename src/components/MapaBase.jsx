'use client'; // Le dice a Next.js que esto corre estrictamente en el cliente

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { obtenerLugares, CATEGORIAS } from '@/lib/api';
import { colorSubcategoria } from '@/lib/colores';
import PlaceCard from './PlaceCard';
import LeyendaMapa from './LeyendaMapa';

// Pin como DivIcon (círculo de color + emoji) en vez de imagen, para no pedir assets extra al mapa.
// El emoji viene de la categoria (grupo amplio); el color viene de la subcategoria cuando existe
// (identifica el tipo puntual: volcán, reserva, mercado, etc.), si no cae al color de la categoria.
function crearIcono(lugar) {
  const cat = CATEGORIAS[lugar.categoria] || { color: '#1B5A6B', emoji: '📍' };
  const color = colorSubcategoria(lugar.subcategoria) || cat.color;
  const esPremium = lugar.tier === 'PREMIUM';
  return L.divIcon({
    className: '',
    html: `<div class="${esPremium ? 'pin-premium' : ''}" style="
      background:${color};
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 4px rgba(0,0,0,0.4);
      border:2px solid white;">
      <span style="transform:rotate(45deg);font-size:15px;">${cat.emoji}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function MapaBase() {
  // Coordenadas base (ej. apuntando a Managua/Chiltepe)
  const posicionInicial = [12.1364, -86.2514];

  // Nicaragua completa, con un poco de margen (evita ver medio océano al alejar el zoom)
  const limitesNicaragua = [
    [10.5, -88.2],
    [15.3, -82.2],
  ];

  const [lugares, setLugares] = useState([]);
  const [subcategoriaActiva, setSubcategoriaActiva] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerLugares()
      .then(setLugares)
      .catch((err) => setError(err.message));
  }, []);

  const lugaresVisibles = useMemo(
    () => (subcategoriaActiva ? lugares.filter((l) => l.subcategoria === subcategoriaActiva) : lugares),
    [lugares, subcategoriaActiva]
  );

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg relative">
      {error && (
        <p className="absolute z-[1000] top-2 left-1/2 -translate-x-1/2 bg-white text-sm text-red-600 px-3 py-1 rounded shadow">
          {error}
        </p>
      )}
      <MapContainer
        center={posicionInicial}
        zoom={10}
        minZoom={7}
        maxBounds={limitesNicaragua}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Mapa vectorial de MapTiler: reduce ~70% el ancho de banda vs. tiles raster */}
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=Msq4y0V1N90b6dRGfSR6"
        />

        {lugaresVisibles.map((lugar) => (
          <Marker
            key={lugar.id}
            position={[lugar.latitud, lugar.longitud]}
            icon={crearIcono(lugar)}
          >
            <Popup>
              <PlaceCard lugar={lugar} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <LeyendaMapa
        lugares={lugares}
        seleccionada={subcategoriaActiva}
        onSeleccionar={setSubcategoriaActiva}
      />
    </div>
  );
}

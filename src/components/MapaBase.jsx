'use client'; // Le dice a Next.js que esto corre estrictamente en el cliente

import { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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
      width:34px;height:34px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 3px 6px rgba(0,0,0,0.35);
      border:2.5px solid white;">
      <span style="transform:rotate(45deg);font-size:16px;">${cat.emoji}</span>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

// Ajusta el encuadre del mapa a los puntos de una ruta (se usa desde /rutas/[id]).
function EncuadrarRuta({ posiciones }) {
  const map = useMap();
  useEffect(() => {
    if (posiciones.length > 0) {
      map.fitBounds(posiciones, { padding: [40, 40], maxZoom: 12 });
    }
  }, [map, posiciones]);
  return null;
}

// Centra el mapa en un lugar puntual y abre su popup (se usa desde /rutas/[id] al
// tocar una parada de la lista, para que "salte" al pin correspondiente).
function EnfocarLugar({ lugarEnfocado, lugares, markersRef }) {
  const map = useMap();
  useEffect(() => {
    if (!lugarEnfocado) return;
    const lugar = lugares.find((l) => l.id === lugarEnfocado);
    const marker = markersRef.current.get(lugarEnfocado);
    if (lugar && marker) {
      map.panTo([lugar.latitud, lugar.longitud]);
      marker.openPopup();
    }
  }, [lugarEnfocado, lugares, map, markersRef]);
  return null;
}

export default function MapaBase({ lugaresIniciales, rutaParadas, mostrarLeyenda = true, lugarEnfocado }) {
  // Coordenadas base (ej. apuntando a Managua/Chiltepe)
  const posicionInicial = [12.1364, -86.2514];

  // Nicaragua completa, con un poco de margen (evita ver medio océano al alejar el zoom)
  const limitesNicaragua = [
    [10.5, -88.2],
    [15.3, -82.2],
  ];

  const [lugares, setLugares] = useState(lugaresIniciales ?? []);
  const [subcategoriaActiva, setSubcategoriaActiva] = useState(null);
  const [error, setError] = useState(null);
  const markersRef = useRef(new Map());

  useEffect(() => {
    // Si nos pasan los lugares ya armados (ej. los de una ruta puntual), no pedimos todo el catálogo.
    if (lugaresIniciales) return;
    obtenerLugares()
      .then(setLugares)
      .catch((err) => setError(err.message));
  }, [lugaresIniciales]);

  const lugaresVisibles = useMemo(
    () => (subcategoriaActiva ? lugares.filter((l) => l.subcategoria === subcategoriaActiva) : lugares),
    [lugares, subcategoriaActiva]
  );

  const posicionesRuta = useMemo(
    () => (rutaParadas || []).map((l) => [l.latitud, l.longitud]),
    [rutaParadas]
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

        {posicionesRuta.length > 1 && (
          <Polyline positions={posicionesRuta} pathOptions={{ color: '#10546F', weight: 3, dashArray: '6 8' }} />
        )}
        {posicionesRuta.length > 0 && <EncuadrarRuta posiciones={posicionesRuta} />}
        {lugarEnfocado && (
          <EnfocarLugar lugarEnfocado={lugarEnfocado} lugares={lugares} markersRef={markersRef} />
        )}

        {lugaresVisibles.map((lugar) => (
          <Marker
            key={lugar.id}
            position={[lugar.latitud, lugar.longitud]}
            icon={crearIcono(lugar)}
            ref={(m) => {
              if (m) markersRef.current.set(lugar.id, m);
              else markersRef.current.delete(lugar.id);
            }}
          >
            <Popup>
              <PlaceCard lugar={lugar} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {mostrarLeyenda && (
        <LeyendaMapa
          lugares={lugares}
          seleccionada={subcategoriaActiva}
          onSeleccionar={setSubcategoriaActiva}
        />
      )}
    </div>
  );
}

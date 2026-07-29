"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const posicionInicial = [12.1364, -86.2514]; // Managua/Chiltepe
const limitesNicaragua = [
  [10.5, -88.2],
  [15.3, -82.2],
];

const iconoSeleccion = L.divIcon({
  className: "",
  html: `<div style="
    background:#AC6727;
    width:28px;height:28px;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 4px rgba(0,0,0,0.4);
    border:2px solid white;"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function ClicksDelMapa({ onSeleccionar }) {
  useMapEvents({
    click(e) {
      onSeleccionar({ latitud: e.latlng.lat, longitud: e.latlng.lng });
    },
  });
  return null;
}

export default function SelectorUbicacion({ posicion, onSeleccionar }) {
  return (
    <div className="w-full h-72 rounded-lg overflow-hidden border border-secondary/40 relative">
      <MapContainer
        center={posicion ? [posicion.latitud, posicion.longitud] : posicionInicial}
        zoom={9}
        minZoom={7}
        maxBounds={limitesNicaragua}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=Msq4y0V1N90b6dRGfSR6"
        />
        <ClicksDelMapa onSeleccionar={onSeleccionar} />
        {posicion && <Marker position={[posicion.latitud, posicion.longitud]} icon={iconoSeleccion} />}
      </MapContainer>

      {!posicion && (
        <p className="absolute z-[1000] top-2 left-1/2 -translate-x-1/2 bg-white text-xs text-brand-text px-3 py-1 rounded shadow">
          Tocá el mapa donde está tu negocio
        </p>
      )}
    </div>
  );
}

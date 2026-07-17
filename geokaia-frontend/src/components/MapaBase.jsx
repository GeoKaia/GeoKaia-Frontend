'use client'; // Le dice a Next.js que esto corre estrictamente en el cliente

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapaBase() {
  // Coordenadas base (ej. apuntando a Managua/Chiltepe)
  const posicionInicial = [12.1364, -86.2514]; 
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={posicionInicial} 
        zoom={10} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Usando MapTiler para optimizar carga (reemplaza 'TU_API_KEY' luego) */}
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=Msq4y0V1N90b6dRGfSR6"
        />
        
        {/* Un pin de prueba para ver que renderiza bien */}
        <Marker position={posicionInicial}>
          <Popup>
            📍 Aquí irán los lugares de GeoKaia.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { ImageOff, Clock, MapPin } from 'lucide-react';
import { CATEGORIAS } from '@/lib/api';
import { normalizarUrlImagen } from '@/lib/imagenes';

function Miniatura({ url, alt }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-14 h-14 flex-none rounded bg-secondary/20 flex items-center justify-center snap-start">
        <ImageOff size={16} className="text-brand-text/40" />
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex-none snap-start">
      <img
        src={normalizarUrlImagen(url)}
        alt={alt}
        onError={() => setError(true)}
        className="w-14 h-14 rounded object-cover"
      />
    </a>
  );
}

export default function PlaceCard({ lugar }) {
  const cat = CATEGORIAS[lugar.categoria] || { label: lugar.categoria, Icono: MapPin };
  const esPremium = lugar.tier === 'PREMIUM';
  const [fotoError, setFotoError] = useState(false);
  const [descripcionExpandida, setDescripcionExpandida] = useState(false);

  useEffect(() => {
    setFotoError(false);
  }, [lugar.fotoUrl]);

  const urlWaze = `https://waze.com/ul?ll=${lugar.latitud},${lugar.longitud}&navigate=yes`;
  const urlGoogleMaps = `https://www.google.com/maps/dir/?api=1&destination=${lugar.latitud},${lugar.longitud}`;
  const urlWhatsapp = lugar.whatsapp
    ? `https://wa.me/${lugar.whatsapp.replace(/\D/g, '')}`
    : null;

  const categoriaBadge = (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full text-white shadow-sm"
      style={{ backgroundColor: cat.color }}
    >
      <cat.Icono size={12} /> {cat.label}
    </span>
  );

  return (
    <div className="w-56 text-brand-text rounded-xl overflow-hidden bg-white shadow-sm">
      {lugar.fotoUrl && (
        <div className="relative">
          {!fotoError ? (
            <img
              src={normalizarUrlImagen(lugar.fotoUrl)}
              alt={lugar.nombre}
              onError={() => setFotoError(true)}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-secondary/20 flex flex-col items-center justify-center text-center px-2">
              <ImageOff size={28} className="text-brand-text/40" />
              <span className="text-[11px] text-brand-text/50 mt-1">No se pudo cargar la imagen</span>
            </div>
          )}
          {!fotoError && (
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent" />
          )}
          <div className="absolute left-2 bottom-2">{categoriaBadge}</div>
        </div>
      )}

      <div className="p-3">
        {!lugar.fotoUrl && <div className="mb-1">{categoriaBadge}</div>}

        {esPremium && lugar.galeriaUrls?.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto snap-x snap-mandatory mb-2 pb-0.5">
            {lugar.galeriaUrls.map((url) => (
              <Miniatura key={url} url={url} alt={lugar.nombre} />
            ))}
          </div>
        )}

        <h3 className="font-bold text-base leading-tight mt-1">{lugar.nombre}</h3>
      <p className={`text-sm text-gray-600 mt-1 ${descripcionExpandida ? '' : 'line-clamp-3'}`}>
        {lugar.descripcion}
      </p>
      {lugar.descripcion?.length > 100 && (
        <button
          type="button"
          onClick={() => setDescripcionExpandida((v) => !v)}
          className="text-xs text-accent-dark font-medium mt-0.5 hover:underline"
        >
          {descripcionExpandida ? 'Leer menos' : 'Leer más'}
        </button>
      )}

      {lugar.horarios && (
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Clock size={12} /> {lugar.horarios}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <a
          href={urlGoogleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-full bg-accent !text-white hover:opacity-90"
        >
          Google Maps
        </a>
        <a
          href={urlWaze}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-full bg-accent-dark !text-white hover:opacity-90"
        >
          Waze
        </a>
      </div>

      {esPremium && (
        <div className="flex flex-wrap gap-2 mt-2 border-t border-gray-100 pt-2">
          {urlWhatsapp && (
            <a
              href={urlWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded bg-primary !text-white hover:opacity-90"
            >
              WhatsApp
            </a>
          )}
          {lugar.menuUrl && (
            <a
              href={lugar.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded bg-secondary !text-brand-text hover:opacity-90"
            >
              Ver menú
            </a>
          )}
          {lugar.panoramaUrl && (
            <a
              href={lugar.panoramaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded border border-accent !text-accent hover:bg-accent hover:!text-white"
            >
              Ver en 360°
            </a>
          )}
          {lugar.videoUrl && (
            <a
              href={lugar.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded border border-accent-dark !text-accent-dark hover:bg-accent-dark hover:!text-white"
            >
              Ver video
            </a>
          )}
        </div>
      )}

      {esPremium && lugar.audioUrl && (
        <audio controls src={lugar.audioUrl} className="w-full mt-2 h-8">
          Tu navegador no soporta audio.
        </audio>
      )}
      </div>
    </div>
  );
}

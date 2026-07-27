export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://geokaia-backend.onrender.com';

// La paleta de Diana solo trae 4 colores para 5 categorías -> ARTESANIA reutiliza el secundario.
export const CATEGORIAS = {
  GASTRONOMIA: { label: 'Gastronomía', color: '#B8722E', emoji: '🍽️' },
  CULTURA: { label: 'Cultura', color: '#1B5A6B', emoji: '🎭' },
  NATURALEZA: { label: 'Naturaleza', color: '#0F3D4A', emoji: '🌋' },
  HISTORIA: { label: 'Historia', color: '#D9A15B', emoji: '🏛️' },
  ARTESANIA: { label: 'Artesanía', color: '#D9A15B', emoji: '🧺' },
};

export async function obtenerLugares() {
  const res = await fetch(`${API_URL}/api/lugares`, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudieron cargar los lugares');
  return res.json();
}

export async function obtenerMiLugar(token) {
  const res = await fetch(`${API_URL}/api/lugares/mi-lugar`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'No se pudo cargar tu lugar');
  return data;
}

export async function actualizarMiLugar(token, cambios) {
  const res = await fetch(`${API_URL}/api/lugares/mi-lugar`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cambios),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'No se pudo actualizar el lugar');
  return data;
}
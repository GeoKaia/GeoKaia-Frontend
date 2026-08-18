# GeoKaia Frontend

Interfaz web de GeoKaia — Plataforma de turismo digital para Nicaragua.
Deployada en: https://geo-kaia-frontend.vercel.app

> Plataforma interactiva de turismo creativo y cultural en Nicaragua que utiliza IA para recomendar rutas curadas y experiencias inmersivas 360°. Proyecto desarrollado por el equipo Techyardigans para el Hackathon Nicaragua 2026 (categoría Avanzado).

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Tecnologías usadas](#tecnologías-usadas)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Dependencias](#dependencias)
- [Variables de entorno](#variables-de-entorno)
- [Estructura modular](#estructura-modular)
- [Páginas de la aplicación](#páginas-de-la-aplicación)
- [Seguridad y validación](#seguridad-y-validación)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Descripción general

GeoKaia centraliza y optimiza la exploración turística en Nicaragua mediante un mapa interactivo y rutas temáticas curadas. Este repo es el frontend (Next.js) y consume la API del repo [GeoKaia-Backend](https://github.com/GeoKaia/GeoKaia-Backend).

El sistema atiende a dos tipos de usuarios:
* **Turistas (B2C)**: exploran el mapa y las rutas sin necesidad de crear cuenta, y consultan a Kaia, un agente de IA que recomienda rutas existentes según lo que describen.
* **Negocios y MiPymes (B2B)**: se registran, eligen un plan (Gratis o Premium) y cargan su lugar — que queda pendiente de aprobación del equipo GeoKaia antes de salir al mapa público.

---

## Tecnologías usadas

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js (App Router) | 16.x | Framework de React, renderizado y ruteo de la app |
| React | 19.x | Librería de UI |
| Tailwind CSS | 4.x | Estilos utilitarios, tokens de la paleta oficial en `globals.css` |
| Leaflet + react-leaflet | 1.9 / 5.x | Mapa interactivo y capas vectoriales |
| MapTiler | N/A | Proveedor de tiles base (mapa vectorial, menor consumo de ancho de banda que raster) |
| Pannellum | N/A | Visor inmersivo de panorámicas 360° para lugares Premium |
| Turf.js | 7.x | Cálculos geoespaciales sobre el GeoJSON de departamentos |

---

## Instalación

**Requisitos previos:**

- Node.js >= 18
- Git
- El backend de GeoKaia corriendo (local o el deployado en Render)

```bash
# 1. Clona el repositorio
git clone https://github.com/GeoKaia/GeoKaia-Frontend.git
cd GeoKaia-Frontend

# 2. Instala las dependencias
npm install

# 3. (Opcional) configura la URL del backend
cp .env.example .env.local
# Por defecto apunta al backend deployado en Render — editalo solo si vas a
# levantar el backend en local (ver Variables de entorno más abajo)
```

---

## Ejecución

```bash
npm run dev
```

Levanta el servidor de desarrollo (Turbopack) en `http://localhost:3000`, con hot reload ante cualquier cambio en `src/`.

Otros scripts:

```bash
npm run build   # build de producción
npm run start   # sirve el build de producción
npm run lint    # ESLint
```

En producción, la app está deployada en [Vercel](https://vercel.com), con deploy automático al pushear a `main`.

---

## Arquitectura del sistema

```
[ Next.js App Router — este repo ]
  |-- src/app/            Páginas (una carpeta por ruta, patrón de Next.js)
  |-- src/components/     Componentes reutilizables (mapa, tarjetas, formularios)
  |-- src/lib/            Cliente de la API, auth (localStorage), paletas de color
            |
            | fetch() -> NEXT_PUBLIC_API_URL
            v
[ GeoKaia-Backend — API REST en Express, repo aparte ]
            |
            v
[ PostgreSQL en Neon ]
```

**Decisiones clave:**
- **Sin estado global ni librería de fetching**: cada página hace `fetch` directo a través de las funciones de `src/lib/api.js` y maneja su propio estado de carga/error con `useState`/`useEffect` — a este tamaño de proyecto, Redux/React Query hubiera sido sobre-ingeniería.
- **Sesión en `localStorage`**: el JWT del negocio se guarda en `localStorage` (`src/lib/auth.js`), sin cookies ni SSR de datos privados — todo lo que requiere sesión se renderiza como Client Component (`"use client"`).
- **Mapa cargado dinámicamente sin SSR**: `MapaBase` se importa con `next/dynamic({ ssr: false })` porque Leaflet depende de `window`, que no existe en el servidor.
- **Imágenes por URL, no upload**: igual que el backend, las fotos se pegan como link (con normalización automática de links de Google Drive/Dropbox y fallback visual si la imagen no carga) — no hay infraestructura de storage de archivos.

---

## Dependencias

| Paquete | Uso |
|---|---|
| `next`, `react`, `react-dom` | Framework y librería de UI |
| `leaflet`, `react-leaflet` | Mapa interactivo |
| `@turf/boolean-point-in-polygon`, `@turf/helpers`, `@turf/simplify` | Geometría sobre el GeoJSON de departamentos de Nicaragua |
| `tailwindcss`, `@tailwindcss/postcss` *(dev)* | Estilos |
| `eslint`, `eslint-config-next` *(dev)* | Lint |

---

## Variables de entorno

Copiá `.env.example` a `.env.local` si necesitás cambiar el valor por default:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | URL base de la API del backend. Default: `https://geokaia-backend.onrender.com`. Usá `http://localhost:4000` para apuntar a un backend corriendo en local |

---

## Estructura modular

```
src/
├── app/                          # Rutas (App Router de Next.js), una carpeta por página
│   ├── page.js                   # Home: chat de Kaia + mapa
│   ├── rutas/                    # Listado y detalle de rutas
│   ├── destacados/                # Lugares con tier Premium
│   ├── negocio/login|registro/    # Auth de negocios (login + 2FA, registro)
│   ├── panel-negocio/             # Elegir plan, alta y edición del lugar propio
│   ├── admin/                     # Cola de aprobación de lugares + CRUD de rutas
│   └── ajustes/                   # Cerrar sesión, borrar cuenta
├── components/                   # Header, BottomNav, MapaBase, PlaceCard, RouteCard, AuthHero...
└── lib/
    ├── api.js                    # Un fetch tipado por endpoint del backend + paleta de categorías
    ├── auth.js                   # Guardar/leer/borrar el JWT en localStorage
    ├── colores.js                # Paleta de colores para subcategorías y rutas
    └── imagenes.js                # Normalización de URLs de imagen (Drive/Dropbox)
```

---

## Páginas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Chat de Kaia + mapa interactivo con todos los lugares aprobados |
| `/rutas`, `/rutas/[id]` | Público | Listado y detalle de rutas curadas (mapa + paradas con distancia/tiempo) |
| `/destacados` | Público | Lugares con tier Premium |
| `/negocios`, `/sobre`, `/leads` | Público | Información institucional y formulario de contacto |
| `/negocio/registro`, `/negocio/login` | Público | Alta de cuenta de negocio (2FA) e inicio de sesión |
| `/panel-negocio` | Negocio | Elegir plan, registrar y editar el lugar propio |
| `/ajustes` | Negocio | Cerrar sesión, borrar cuenta |
| `/admin/login`, `/admin` | Admin | Cola de aprobación de lugares registrados por negocios |
| `/admin/rutas` | Admin | Crear, editar y borrar rutas a partir de lugares ya aprobados |

---

## Seguridad y validación

- **Formularios validados**: cada formulario valida en el cliente antes de enviar (longitudes mínimas, campos requeridos) y además confía en la validación del backend (Zod) como última barrera.
- **Rutas protegidas por rol**: las páginas de negocio (`/panel-negocio`, `/ajustes`) chequean que exista un JWT válido; las de admin (`/admin`, `/admin/rutas`) además verifican contra el backend que la cuenta tenga `esAdmin: true` antes de mostrar contenido.
- **2FA**: el login de negocio no entrega acceso hasta verificar el código TOTP de Google Authenticator.
- **Expiración de sesión**: el JWT vence a las 8 horas; al expirar, la app redirige a login en vez de mostrar un error genérico.

---

## Contribuciones

Flujo de trabajo: rama por feature (`feat/nombre-descriptivo`), commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) y Pull Request hacia `main` para mantener trazabilidad y revisión antes de mergear.

## Créditos

- Límites departamentales de Nicaragua (`public/geo/nicaragua-departamentos.geojson`): datos de [OpenStreetMap](https://www.openstreetmap.org/copyright) obtenidos vía [pacisauctor/geojson-nicaragua](https://github.com/pacisauctor/geojson-nicaragua), distribuidos bajo licencia [ODbL](https://opendatacommons.org/licenses/odbl/). Geometrías simplificadas para reducir el peso del bundle.

## Licencia

Proyecto desarrollado con fines académicos para el Hackathon Nicaragua 2026.

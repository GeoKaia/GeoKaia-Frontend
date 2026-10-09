# GeoKaia Frontend

Interfaz web de GeoKaia — Plataforma de turismo digital para Nicaragua.
Deployada en: https://geo-kaia-frontend.vercel.app

> Plataforma interactiva de turismo creativo y cultural en Nicaragua que utiliza IA para recomendar rutas curadas y experiencias inmersivas 360°. Proyecto desarrollado por el equipo Techyardigans para el Hackathon Nicaragua 2026 (categoría Avanzado).

---

<h3 align="center">Stack</h3>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-10546F?style=for-the-badge&logo=nextdotjs&logoColor=white&labelColor=3A2B1D" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-10546F?style=for-the-badge&logo=react&logoColor=white&labelColor=3A2B1D" alt="React 19" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-4-2989A3?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=3A2B1D" alt="Tailwind CSS 4" /></a>
  <a href="https://gsap.com"><img src="https://img.shields.io/badge/GSAP-3-2989A3?style=for-the-badge&logo=greensock&logoColor=white&labelColor=3A2B1D" alt="GSAP 3" /></a>
  <a href="https://lucide.dev"><img src="https://img.shields.io/badge/Lucide-iconos-2989A3?style=for-the-badge&logo=lucide&logoColor=white&labelColor=3A2B1D" alt="Lucide" /></a>
</p>

<p align="center">
  <a href="https://leafletjs.com"><img src="https://img.shields.io/badge/Leaflet-1.9-AC6727?style=for-the-badge&logo=leaflet&logoColor=white&labelColor=3A2B1D" alt="Leaflet 1.9" /></a>
  <a href="https://www.maptiler.com"><img src="https://img.shields.io/badge/MapTiler-mapa%20vectorial-AC6727?style=for-the-badge&logo=maptiler&logoColor=white&labelColor=3A2B1D" alt="MapTiler" /></a>
  <a href="https://pannellum.org"><img src="https://img.shields.io/badge/Pannellum-visor%20360%C2%B0-AC6727?style=for-the-badge&labelColor=3A2B1D" alt="Pannellum" /></a>
  <a href="https://turfjs.org"><img src="https://img.shields.io/badge/Turf.js-7-AC6727?style=for-the-badge&labelColor=3A2B1D" alt="Turf.js 7" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-deploy-3A2B1D?style=for-the-badge&logo=vercel&logoColor=white&labelColor=3A2B1D" alt="Desplegado en Vercel" /></a>
</p>

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
| Pannellum | 2.5 | Visor de fotos 360° para lugares Premium (videos 360 de YouTube y recorridos como Travvir se incrustan en el mismo visor) |
| GSAP | 3.x | Animaciones de la bienvenida, el chat de Kaia y los pines |
| lucide-react | 1.x | Íconos vectoriales de la interfaz y del mapa |
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
- **Sesión en cookie httpOnly**: el backend deja el JWT en la cookie `gk_sesion` (httpOnly, Secure, SameSite=Lax, 8 h); JavaScript no puede leerla. El frontend llama a `/api/*` en su propio dominio (rewrites hacia el backend), pregunta `GET /api/auth/me` para saber quién es y `src/proxy.js` valida la sesión en el servidor antes de mostrar `/admin/*` y `/panel-negocio`.
- **Mapa cargado dinámicamente sin SSR**: `MapaBase` se importa con `next/dynamic({ ssr: false })` porque Leaflet depende de `window`, que no existe en el servidor.
- **Imágenes por URL, no upload**: igual que el backend, las fotos se pegan como link (con normalización automática de links de Google Drive/Dropbox y fallback visual si la imagen no carga) — no hay infraestructura de storage de archivos.

---

## Dependencias

| Paquete | Uso |
|---|---|
| `next`, `react`, `react-dom` | Framework y librería de UI |
| `leaflet`, `react-leaflet` | Mapa interactivo |
| `@turf/boolean-point-in-polygon`, `@turf/helpers`, `@turf/simplify` | Geometría sobre el GeoJSON de departamentos de Nicaragua |
| `gsap` | Animaciones (splash de bienvenida, chat de Kaia) |
| `lucide-react` | Íconos |
| `pannellum` | Visor de fotos 360° (`Visor360`) |
| `tailwindcss`, `@tailwindcss/postcss` *(dev)* | Estilos |
| `eslint`, `eslint-config-next` *(dev)* | Lint |

---

## Variables de entorno

Copiá `.env.example` a `.env.local` si necesitás cambiar el valor por default:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `BACKEND_URL` | No | URL del backend, solo del lado del servidor. Next reenvía `/api/*` a esa dirección (rewrites) y el proxy de sesión la usa para validar la cookie. Default: `https://geokaia-backend.onrender.com`. Usá `http://localhost:4000` para un backend local |

---

## Estructura modular

```
src/
├── app/                          # Rutas (App Router de Next.js), una carpeta por página
│   ├── page.js                   # Home: chat de Kaia + mapa
│   ├── bienvenida/               # Onboarding: splash animado + carrusel (marco de celular en escritorio)
│   ├── privacidad/, terminos/    # Política de Privacidad y Términos y Condiciones (Ley 787 / Ley 842)
│   ├── rutas/                    # Listado y detalle de rutas
│   ├── destacados/                # Lugares con tier Premium
│   ├── negocio/login|registro/    # Auth de negocios (login + 2FA, registro)
│   ├── panel-negocio/             # Elegir plan, alta y edición del lugar propio
│   ├── admin/                     # Cola de aprobación de lugares + CRUD de rutas
│   └── ajustes/                   # Modo oscuro, tamaño de letra, información legal; cerrar sesión y borrar cuenta
├── components/                   # BottomNav, MapaBase, PlaceCard, Visor360, RouteCard, PaginaLegal, AuthHero...
└── lib/
    ├── api.js                    # Un fetch tipado por endpoint del backend + paleta de categorías
    ├── auth.js                   # Guardar/leer/borrar el JWT en localStorage
    ├── colores.js                # Paleta de colores para subcategorías y rutas
    ├── imagenes.js               # Normalización de URLs de imagen (Drive/Dropbox)
    ├── panorama.js               # Tipo de link 360° (foto, YouTube, recorrido web) y su URL de incrustación
    ├── urls.js                   # Solo enlaza URLs http(s): barrera contra javascript: en href
    ├── preferencias.js, usePreferencias.js   # Modo oscuro y tamaño de letra (localStorage)
    └── legal.js                  # Versión y fecha de los documentos legales
```

---

## Páginas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/bienvenida` | Público | Onboarding de primera visita (splash + carrusel); se puede reabrir desde Ajustes |
| `/` | Público | Chat de Kaia + mapa interactivo con todos los lugares aprobados |
| `/rutas`, `/rutas/[id]` | Público | Listado y detalle de rutas curadas (mapa + paradas con distancia/tiempo) |
| `/destacados` | Público | Lugares con tier Premium (galería, video y visor 360°) |
| `/negocios`, `/sobre`, `/leads` | Público | Información institucional y formulario de contacto |
| `/negocio/registro`, `/negocio/login` | Público | Alta de cuenta de negocio (2FA) e inicio de sesión |
| `/panel-negocio` | Negocio | Elegir plan, registrar y editar el lugar propio |
| `/ajustes` | Público / Negocio | Modo oscuro, tamaño de letra y enlaces legales (todos); cerrar sesión y borrar cuenta (negocio) |
| `/privacidad`, `/terminos` | Público | Política de Privacidad y Términos y Condiciones |
| `/admin/login`, `/admin` | Admin | Cola de aprobación de lugares registrados por negocios |
| `/admin/rutas` | Admin | Crear, editar y borrar rutas a partir de lugares ya aprobados |

---

## Seguridad y validación

- **Formularios validados**: cada formulario valida en el cliente antes de enviar (longitudes mínimas, campos requeridos) y además confía en la validación del backend (Zod) como última barrera.
- **Rutas protegidas por rol, en el servidor**: `src/proxy.js` consulta al backend (`GET /api/auth/me`) antes de servir `/panel-negocio` y `/admin/*`. Sin sesión válida redirige al login; una cuenta que no es admin que escribe `/admin` vuelve al inicio sin ver la interfaz de administración. La API sigue validando cada petición por su cuenta.
- **Enlaces seguros**: los links que carga un negocio (video, menú, mapas, galería, 360°) solo se muestran si empiezan con `http://` o `https://` (`src/lib/urls.js`, `src/lib/panorama.js`); un texto como `javascript:...` nunca llega a un `href` ni a un `iframe`. El backend lo rechaza además al guardar.
- **Sin HTML inyectado**: no se usa `dangerouslySetInnerHTML` con datos de usuarios; React escapa el texto que llega de la API.
- **Consentimiento**: el registro de un negocio exige marcar la aceptación de los Términos y la Política de Privacidad, y el backend guarda la fecha y la versión aceptadas.
- **2FA**: el login de negocio no entrega acceso hasta verificar el código TOTP de Google Authenticator.
- **Expiración de sesión**: el JWT vence a las 8 horas; al expirar, la app redirige a login en vez de mostrar un error genérico.

---

## Contribuciones

Flujo de trabajo: rama por feature (`feat/nombre-descriptivo`), commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) y Pull Request hacia `main` para mantener trazabilidad y revisión antes de mergear.

## Créditos

- Límites departamentales de Nicaragua (`public/geo/nicaragua-departamentos.geojson`): datos de [OpenStreetMap](https://www.openstreetmap.org/copyright) obtenidos vía [pacisauctor/geojson-nicaragua](https://github.com/pacisauctor/geojson-nicaragua), distribuidos bajo licencia [ODbL](https://opendatacommons.org/licenses/odbl/). Geometrías simplificadas para reducir el peso del bundle.

## Licencia

Proyecto desarrollado con fines académicos para el Hackathon Nicaragua 2026.

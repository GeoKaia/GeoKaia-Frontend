import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import BottomNav from "@/components/BottomNav";
import { SCRIPT_PREFERENCIAS } from "@/lib/preferencias";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GeoKaia",
  description: "Turismo digital para Nicaragua — rutas curadas y guía con IA.",
};

export const viewport = {
  // El tema por defecto es el claro sin importar el del sistema, así que el color de la barra del
  // navegador también es fijo.
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: el script de preferencias cambia la clase `dark` y data-font-scale de
    // <html> antes de que React hidrate; esa diferencia es esperada.
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16 bg-brand-bg text-brand-text">
        {/* beforeInteractive: se ejecuta antes de hidratar y antes del primer pintado, sin destello de tema. */}
        <Script id="preferencias-gk" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: SCRIPT_PREFERENCIAS }} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[3000] focus:rounded-lg focus:bg-accent-dark focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Spline_Sans } from "next/font/google";
import "./globals.css";

// 1. Configuramos Spline Sans (La nueva fuente del Admin)
const spline = Spline_Sans({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spline", // Agregamos esto para usarla en Tailwind si hace falta
});

// 2. Cargamos Plus Jakarta Sans (Por si la usás en el menú público)
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Club Cheka",
  description: "Carta Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Agregamos AMBAS variables de fuente aquí
    <html lang="es" className={`${jakarta.variable} ${spline.variable}`} style={{ overflowY: 'scroll' }}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      
      {/* IMPORTANTE: Agregamos 'spline.className' aquí.
         Esto hace que Spline Sans sea la fuente por defecto de toda la app.
      */}
      <body 
        className={`${spline.className} bg-[#050505] antialiased min-h-screen`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
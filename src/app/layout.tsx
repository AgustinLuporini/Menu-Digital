import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. Cargamos la fuente Plus Jakarta Sans
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
    <html lang="es" className={jakarta.variable} style={{ overflowY: 'scroll' }}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      {/* Sacamos 'flex justify-center' del body si lo tenías, dejamos solo el fondo */}
      <body 
      className="bg-[#050505] font-display antialiased min-h-screen"
      suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Dejalo vacío por ahora. Vercel se encarga de todo.
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Esto permite cargar imágenes de Supabase/cualquier lado
      },
    ],
  },
};

export default nextConfig;
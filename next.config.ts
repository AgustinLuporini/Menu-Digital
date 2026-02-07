import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dejá esto vacío. No fuerces rutas si estás en tu propio dominio.
  basePath: "/menu",

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },
};

export default nextConfig;
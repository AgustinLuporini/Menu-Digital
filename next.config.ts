import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Permitir imágenes de cualquier dominio por HTTPS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },

  // 2. Conectar la ruta /menu con el Vercel donde tienen el sistema
  async rewrites() {
    return [
      {
        source: '/menu',
        // ACORDATE: Cambiá esta URL por el dominio real de Vercel de tu menú
        destination: 'https://el-vercel-de-tu-menu.vercel.app/menu', 
      },
      {
        source: '/menu/:path*',
        // ACORDATE: Acá también va la URL real
        destination: 'https://el-vercel-de-tu-menu.vercel.app/menu/:path*',
      },
    ]
  }
};

export default nextConfig;
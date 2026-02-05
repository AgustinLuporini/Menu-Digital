export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#0a1016] pt-8 pb-10">
      <div className="px-6 flex flex-col items-center">
        
        {/* BOTÓN WIFI */}
        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all mb-8 border border-white/5 group">
            <span className="material-symbols-outlined text-[18px] group-hover:text-accent transition-colors">wifi</span>
            <span>Solicitar clave WiFi</span>
        </button>

        {/* --- SECCIÓN RESTAURANTE --- */}
        <div className="flex flex-col items-center text-center w-full mb-8">
          <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase mb-5">
            CONECTÁ CON NOSOTROS
          </h3>
          
          <div className="flex justify-center gap-10 w-full">
            {/* 1. INSTAGRAM */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="size-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/5 group-hover:border-accent/50 group-hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-accent transition-colors">photo_camera</span>
              </div>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-slate-400 transition-colors">Insta</span>
            </a>

            {/* 2. GOOGLE MAPS */}
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="size-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/5 group-hover:border-accent/50 group-hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-accent transition-colors">location_on</span>
              </div>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-slate-400 transition-colors">Maps</span>
            </a>

            {/* 3. WHATSAPP RESERVAS */}
            <a href="https://wa.me/5491112345678" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="size-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/5 group-hover:border-accent/50 group-hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-accent transition-colors">chat</span>
              </div>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-slate-400 transition-colors">Reservas</span>
            </a>
          </div>
        </div>

        {/* Separador sutil */}
        <div className="h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* --- SECCIÓN DEVOYS (Branding Final) --- */}
        <div className="flex flex-col items-center">
          {/* Link principal a la web */}
          <a 
            href="https://www.devoys.com.ar/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center group"
          >
            <span className="text-[9px] text-slate-500 mb-1 font-medium">Developed by</span>
            
            {/* TEXTO CON GRADIENTE VIOLETA/ROSA */}
            {/* Usamos colores arbitrarios de Tailwind ([#hex]) para el gradiente */}
            <span className="text-[13px] font-black tracking-[0.15em] bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              DEVOYS
            </span>
          </a>

          {/* Bajada genérica (ya no es link) */}
          <p className="text-[8px] text-slate-600 mt-2 font-medium tracking-wide">
             Soluciones digitales para tu negocio.
          </p>
        </div>

      </div>
    </footer>
  );
}
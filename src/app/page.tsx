import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 flex flex-col">

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full animate-fade-in-down">
        
        {/* Logo / Marca */}
        <div className="flex items-center gap-2 select-none cursor-default">
          <div className="size-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
             <span className="material-symbols-outlined text-white text-lg">rocket_launch</span>
          </div>
          <span className="font-black tracking-tight text-xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            DEVOYS
          </span>
        </div>

        {/* Botonera Derecha */}
        <div className="flex items-center gap-6">
            
            {/* 1. ACCESO PARTNERS (Texto sutil) */}
            <Link 
                href="/login?role=partner" 
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
                <span className="material-symbols-outlined text-sm">handshake</span>
                Acceso Partners
            </Link>

            {/* Separador vertical (solo desktop) */}
            <div className="hidden md:block w-px h-4 bg-white/10"></div>

            {/* 2. ACCESO CLIENTES (Botón Principal) */}
            <Link
            href="/login" // Por defecto asume cliente
            className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-full text-sm font-bold transition-all flex items-center gap-2 group shadow-sm hover:shadow-md"
            >
                <span>Ingresar</span>
                <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-white transition-colors">login</span>
            </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10 max-w-6xl mx-auto w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <span className="size-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          Software Gastronómico SaaS
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white animate-fade-in">
          Digitalizá tu <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Negocio</span>.
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-16 leading-relaxed animate-fade-in delay-100">
          La plataforma todo en uno para gestionar cartas digitales. 
          <br className="hidden md:block" />
          Sin descargas. Sin demoras. Autoadministrable.
        </p>

        {/* --- GRID DE OPCIONES --- */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl animate-fade-in delay-200">

          {/* TARJETA 1: DUEÑOS (Restaurantes) */}
          <div className="bg-[#101010] border border-white/5 p-8 rounded-[2rem] hover:border-primary/50 transition-all group text-left relative overflow-hidden flex flex-col hover:bg-[#151515]">
             <div className="absolute -top-4 -right-4 size-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
             
             <div className="mb-4 size-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="material-symbols-outlined text-2xl text-white">storefront</span>
             </div>

             <h3 className="text-2xl font-bold text-white mb-2">Tengo un Local</h3>
             <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">
                Probá la experiencia real. Mirá cómo tus clientes verían el menú desde sus celulares.
             </p>

             <Link 
                href="/club-cheka" // Link a tu demo
                className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 group-hover:shadow-primary/40 hover:scale-[1.02]"
             >
                <span>Ver Demo en Vivo</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
             </Link>
          </div>

          {/* TARJETA 2: PARTNERS (Revendedores) */}
          <div className="bg-[#101010] border border-white/5 p-8 rounded-[2rem] hover:border-purple-500/50 transition-all group text-left relative overflow-hidden flex flex-col hover:bg-[#151515]">
             <div className="absolute -top-4 -right-4 size-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>

             <div className="mb-4 size-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="material-symbols-outlined text-2xl text-white">partner_exchange</span>
             </div>

             <h3 className="text-2xl font-bold text-white mb-2">Quiero Revender</h3>
             <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">
                Sumate como Partner. Ofrecé nuestra tecnología a comercios de tu zona y ganá comisiones.
             </p>

             <a 
                href="https://wa.me/5491100000000?text=Hola,%20me%20interesa%20ser%20partner%20de%20Devoys" 
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#1A1A1A] border border-white/10 hover:bg-white/10 hover:text-white text-slate-300 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
             >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>Contactar Comercial</span>
             </a>
          </div>

        </div>

      </main>

      <footer className="text-center text-slate-600 text-[10px] py-8 border-t border-white/5 uppercase tracking-widest font-bold">
        © 2026 Devoys • Plataforma SaaS
      </footer>

    </div>
  );
}
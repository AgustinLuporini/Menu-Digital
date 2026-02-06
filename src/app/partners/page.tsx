import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      
      {/* Navbar Simple */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="font-black text-xl tracking-tight text-white hover:opacity-80 transition-opacity">DEVOYS</Link>
        <Link href="/" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Volver al Sitio</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-8">
          <span className="material-symbols-outlined text-sm">handshake</span>
          Programa de Revendedores
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-white">
          Construí tu Negocio de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Software Gastronómico.</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
          Nosotros ponemos la tecnología. Vos ponés los clientes. 
          Generá ingresos recurrentes digitalizando los bares y restaurantes de tu ciudad.
        </p>

        {/* Call to Action Partners */}
        <div className="flex flex-col items-center gap-4">
            <a 
                href="https://wa.me/5491100000000?text=Hola,%20quiero%20ser%20partner%20de%20Devoys" 
                target="_blank"
                className="px-8 py-4 bg-white text-black hover:bg-slate-200 font-bold rounded-full transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3"
            >
                <span className="material-symbols-outlined">chat</span>
                <span>Hablar con un Asesor</span>
            </a>
            <Link href="/login?role=partner" className="text-sm text-slate-500 hover:text-purple-400 underline decoration-slate-700 underline-offset-4 transition-colors">
                Ya soy partner, ingresar
            </Link>
        </div>

        {/* Grid de Beneficios */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 text-left">
            <div className="p-6 rounded-2xl bg-[#101010] border border-white/5">
                <h3 className="font-bold text-white mb-2 text-lg">Marca Blanca</h3>
                <p className="text-slate-500 text-sm">El sistema es tuyo. Tus clientes ven tu gestión y tu soporte. Nosotros somos invisibles.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#101010] border border-white/5">
                <h3 className="font-bold text-white mb-2 text-lg">Alta Rentabilidad</h3>
                <p className="text-slate-500 text-sm">Modelo de suscripción recurrente. Un cliente que entra hoy, te paga todos los meses.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#101010] border border-white/5">
                <h3 className="font-bold text-white mb-2 text-lg">Setup Instantáneo</h3>
                <p className="text-slate-500 text-sm">Creá una cuenta para tu cliente en 10 segundos desde tu panel de control.</p>
            </div>
        </div>

      </main>
    </div>
  );
}
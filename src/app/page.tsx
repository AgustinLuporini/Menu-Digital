"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// --- DATOS DEL CARRUSEL (RUTAS EXACTAS) ---
const SLIDES = [
  {
    id: 1,
    type: "VISTA CLIENTE",
    title: "Navegación Intuitiva",
    description: "Tus clientes escanean y piden. Sin descargas ni PDF lentos.",
    image: "/screenshots/screen1.png", 
    icon: "touch_app",
    colorClass: "bg-orange-500 shadow-orange-500/20"
  },
  {
    id: 2,
    type: "DETALLE PRODUCTO",
    title: "Experiencia Visual",
    description: "Fotos en HD y descripciones claras que aumentan el apetito.",
    image: "/screenshots/screen2.png", 
    icon: "restaurant",
    colorClass: "bg-blue-500 shadow-blue-500/20"
  },
  {
    id: 3,
    type: "PANEL ADMIN",
    title: "Control Total",
    description: "Tu centro de comando. Gestioná categorías y visibilidad al instante.",
    image: "/screenshots/screen3.png", 
    icon: "dashboard",
    colorClass: "bg-slate-900 shadow-slate-900/20"
  },
  {
    id: 4,
    type: "EDICIÓN RÁPIDA",
    title: "Autogestión 100%",
    description: "Cambiá precios, stock o creá platos nuevos en segundos.",
    image: "/screenshots/screen4.png", 
    icon: "edit_square",
    colorClass: "bg-green-600 shadow-green-600/20"
  }
];

// --- COMPONENTE PANTALLA ---
const PhoneScreenCarousel = ({ currentSlide }: { currentSlide: number }) => {
  return (
    <div className="w-full h-full relative bg-gray-50 text-white overflow-hidden font-sans">
       {SLIDES.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
             <div 
                className="absolute inset-0 bg-cover bg-top"
                style={{backgroundImage: `url('${slide.image}')`}}
             >
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent h-24"></div>
             </div>
          </div>
       ))}
    </div>
  );
};

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, []);

  const activeSlide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 overflow-x-hidden">

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="size-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                    <span className="material-symbols-outlined text-lg">restaurant</span>
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900">Devoys</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                <a href="#features" className="hover:text-orange-500 transition-colors">Funcionalidades</a>
                <a href="/partners" className="hover:text-orange-500 transition-colors">Revendedores</a>
            </div>
            <div className="flex gap-4 items-center">
                <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 hidden sm:block">Ingresar</Link>
                <Link href="/login" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5">
                    Prueba Gratis
                </Link>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] bg-blue-50/80 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            
            {/* IZQUIERDA: Texto */}
            <div className="text-left z-10 max-w-2xl animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[11px] font-bold uppercase tracking-widest mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    Tecnología 2026
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-6 text-slate-900">
                    Tu Menú Digital. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Totalmente Tuyo.</span>
                </h1>
                <p className="text-slate-500 text-xl leading-relaxed mb-8 max-w-lg font-medium">
                    La única plataforma que combina una carta digital de lujo para tus clientes con un panel de control ultra rápido para vos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/club-cheka" target="_blank" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-1 text-center flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">visibility</span>
                        Ver Ejemplo Real
                    </Link>
                    <Link href="/login" className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-full transition-all hover:border-slate-300 flex items-center justify-center gap-2">
                        Crear mi Cuenta
                    </Link>
                </div>
            </div>

            {/* DERECHA: Celular */}
            <div className="relative mx-auto lg:mr-0 perspective-1000 group w-full flex justify-center lg:justify-end pt-10 lg:pt-0">
                <div className="relative w-[340px] h-[680px] rotate-y-[-6deg] rotate-x-[4deg] group-hover:rotate-0 transition-transform duration-700 ease-out z-20 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] bg-black rounded-[3.5rem]">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-300 via-gray-100 to-gray-400 rounded-[3.5rem] overflow-hidden flex items-center justify-center shadow-inner border border-gray-400/50">
                        <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] bg-black rounded-[3.2rem] flex items-center justify-center relative overflow-hidden">
                            <div className="w-[calc(100%-20px)] h-[calc(100%-20px)] bg-white rounded-[2.6rem] relative overflow-hidden">
                                <PhoneScreenCarousel currentSlide={currentSlide} />
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 via-transparent to-transparent z-40 opacity-30"></div>
                            </div>
                        </div>
                    </div>
                    {/* Botones físicos */}
                    <div className="absolute top-24 -left-[3px] w-[3px] h-7 bg-gray-400 rounded-l-md shadow-sm"></div>
                    <div className="absolute top-36 -left-[3px] w-[3px] h-12 bg-gray-400 rounded-l-md shadow-sm"></div>
                    <div className="absolute top-52 -left-[3px] w-[3px] h-12 bg-gray-400 rounded-l-md shadow-sm"></div>
                    <div className="absolute top-44 -right-[3px] w-[3px] h-20 bg-gray-400 rounded-r-md shadow-sm"></div>
                </div>

                <div className="absolute top-1/2 -left-4 md:-left-10 z-30 transition-all duration-500 transform -translate-y-1/2">
                    <div key={activeSlide.id} className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-[280px] animate-fade-in-up">
                        <div className={`size-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors duration-500 ${activeSlide.colorClass}`}>
                            <span className="material-symbols-outlined text-2xl">{activeSlide.icon}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{activeSlide.type}</p>
                                <div className="h-1 w-8 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 animate-[progress_4s_linear_infinite]"></div>
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 leading-tight">{activeSlide.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">{activeSlide.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN 2: STATS --- */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-center">
                <div className="px-4 py-4">
                    <p className="text-4xl font-black text-slate-900 mb-1">+25%</p>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Ticket Promedio</p>
                    <p className="text-xs text-slate-400 mt-2">Los menús con fotos venden más.</p>
                </div>
                <div className="px-4 py-4">
                    <p className="text-4xl font-black text-slate-900 mb-1">100%</p>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Autogestionable</p>
                    <p className="text-xs text-slate-400 mt-2">Sin depender de diseñadores.</p>
                </div>
                <div className="px-4 py-4">
                    <p className="text-4xl font-black text-slate-900 mb-1">0s</p>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Tiempo de Espera</p>
                    <p className="text-xs text-slate-400 mt-2">Carta disponible al instante.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: PARA EL DUEÑO (COMPACTA V3) --- */}
      {/* Aumento del 20% en la imagen: w-[260px] -> w-[312px] */}
      <section className="py-8 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            {/* Imagen Admin - Aumentada */}
            <div className="relative order-2 lg:order-1 flex justify-center items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-slate-100 rounded-3xl rotate-3 transform -z-10"></div>
                {/* CAMBIO AQUÍ: w-[312px] */}
                <img src="/screenshots/screen3.png" alt="Panel Admin" className="rounded-xl shadow-xl border border-slate-200 w-[312px] relative z-10" />
                {/* Floating Badge */}
                <div className="absolute -bottom-3 -right-3 bg-white p-2 rounded-lg shadow-lg border border-slate-100 flex items-center gap-2 animate-bounce-slow z-20">
                    <div className="size-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xs">check</span></div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Estado</p>
                        <p className="text-xs font-bold text-slate-800">Guardado</p>
                    </div>
                </div>
            </div>
            {/* Texto */}
            <div className="order-1 lg:order-2">
                <div className="size-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center mb-4"><span className="material-symbols-outlined text-2xl">settings_suggest</span></div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Tu Centro de Comando.<br/>Sin Complicaciones.</h2>
                <p className="text-slate-500 text-base mb-6 leading-relaxed">
                    Olvidate de llamar al soporte técnico para cambiar un precio. Con Devoys, tenés el control total de tu negocio en la palma de tu mano.
                </p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                        <p className="text-slate-600 text-sm"><strong>Edición en vivo:</strong> Cambiá precios y descripciones y se actualizan al instante en todos los QRs.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                        <p className="text-slate-600 text-sm"><strong>Control de Stock:</strong> ¿Se acabó el salmón? Pausá el plato con un clic para que nadie lo pida.</p>
                    </li>
                </ul>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN 4: PARA EL CLIENTE --- */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Texto */}
            <div>
                <div className="size-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6"><span className="material-symbols-outlined text-2xl">sentiment_satisfied</span></div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Una experiencia que<br/>tus clientes aman.</h2>
                <p className="text-slate-500 text-lg mb-6 leading-relaxed">
                    Nadie quiere descargar una app ni esperar a que cargue un PDF pesado. Devoys es rápido, visual y funciona en cualquier celular.
                </p>
                <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-blue-500 mb-2">speed</span>
                        <h4 className="font-bold text-slate-900">Carga Instantánea</h4>
                        <p className="text-xs text-slate-500 mt-1">Optimizado para funcionar rápido incluso con mal 4G.</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-orange-500 mb-2">image</span>
                        <h4 className="font-bold text-slate-900">Fotos HD</h4>
                        <p className="text-xs text-slate-500 mt-1">Mostrá tus platos en alta calidad sin pixelarse.</p>
                    </div>
                </div>
            </div>
            {/* Imagen Cliente */}
            <div className="relative flex justify-center">
                <div className="absolute top-10 right-10 size-32 bg-orange-200 rounded-full blur-[60px] opacity-60"></div>
                <img src="/screenshots/screen1.png" alt="Vista Cliente" className="relative z-10 w-[280px] rounded-[2.5rem] shadow-2xl border-[8px] border-white" />
                <div className="absolute top-20 -right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 z-20 text-xs font-bold text-slate-700 animate-pulse">
                    🍔 ¡Qué buena pinta!
                </div>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN 5: FINAL CTA --- */}
      <section className="py-24 px-6 bg-orange-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">¿Listo para transformar tu restaurante?</h2>
              <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto font-medium">
                  Sumate a los cientos de locales que ya digitalizaron su carta. Empezá gratis hoy mismo, sin tarjetas ni contratos.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/login" className="px-10 py-4 bg-white text-orange-600 font-bold rounded-full text-lg shadow-2xl hover:shadow-orange-900/20 hover:scale-105 transition-all">
                      Empezar Prueba Gratis
                  </Link>
                  <a href="https://wa.me/5491100000000" target="_blank" className="px-10 py-4 bg-orange-600 border border-orange-400 text-white font-bold rounded-full text-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">chat</span>
                      Hablar con Ventas
                  </a>
              </div>
              <p className="mt-8 text-sm text-orange-200 opacity-80">
                  * Plan gratuito disponible para siempre para pequeños locales.
              </p>
          </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center text-sm">
          <p>© 2026 Devoys Software. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}
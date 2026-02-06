"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Smartphone, QrCode, ChefHat, Rocket } from "lucide-react";

// --- DATOS DEL CARRUSEL (Sin cambios) ---
const SLIDES = [
  {
    id: 1, type: "VISTA CLIENTE", title: "Navegación Intuitiva", description: "Tus clientes escanean y piden. Sin descargas.", image: "/screenshots/screen1.png", icon: "touch_app", colorClass: "bg-orange-500 shadow-orange-500/20"
  },
  {
    id: 2, type: "DETALLE PRODUCTO", title: "Experiencia Visual", description: "Fotos en HD y descripciones claras.", image: "/screenshots/screen2.png", icon: "restaurant", colorClass: "bg-blue-500 shadow-blue-500/20"
  },
  {
    id: 3, type: "PANEL ADMIN", title: "Control Total", description: "Gestioná categorías y visibilidad al instante.", image: "/screenshots/screen3.png", icon: "dashboard", colorClass: "bg-slate-900 shadow-slate-900/20"
  },
  {
    id: 4, type: "EDICIÓN RÁPIDA", title: "Autogestión 100%", description: "Cambiá precios o stock en segundos.", image: "/screenshots/screen4.png", icon: "edit_square", colorClass: "bg-green-600 shadow-green-600/20"
  }
];

// --- COMPONENTE PANTALLA (Sin cambios) ---
const PhoneScreenCarousel = ({ currentSlide }: { currentSlide: number }) => {
  return (
    <div className="w-full h-full relative bg-gray-50 text-white overflow-hidden font-sans">
       {SLIDES.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
             <div className="absolute inset-0 bg-cover bg-top" style={{backgroundImage: `url('${slide.image}')`}}>
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

      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] bg-blue-50/80 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto Hero */}
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

            {/* Celular Hero */}
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
                </div>

                <div className="absolute top-1/2 -left-4 md:-left-10 z-30 transition-all duration-500 transform -translate-y-1/2">
                    <div key={activeSlide.id} className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-[280px] animate-fade-in-up">
                        <div className={`size-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors duration-500 ${activeSlide.colorClass}`}>
                            <span className="material-symbols-outlined text-2xl">{activeSlide.icon}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{activeSlide.type}</p>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 leading-tight">{activeSlide.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">{activeSlide.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN NUEVA UBICACIÓN: CÓMO FUNCIONA (ID: how-it-works) --- */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-12">En marcha en minutos</h2>
          {/* Cambiado a grid de 4 columnas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
               <div className="size-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                 <ChefHat className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-bold mb-2">1. Creá tu cuenta</h3>
               <p className="text-slate-500 text-xs">Registrate gratis y cargá tu logo y colores.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
               <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                 <Smartphone className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-bold mb-2">2. Cargá tu Menú</h3>
               <p className="text-slate-500 text-xs">Subí tus productos, precios y fotos desde el panel.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
               <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                 <QrCode className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-bold mb-2">3. Imprimí el QR</h3>
               <p className="text-slate-500 text-xs">Descargá tu código QR listo para poner en las mesas.</p>
            </div>
            {/* 4ta Tarjeta Nueva */}
            <div className="p-6 rounded-2xl bg-green-50 border border-green-100 shadow-sm hover:shadow-md transition-all">
               <div className="size-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                 <Rocket className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-green-800">¡Listo!</h3>
               <p className="text-green-700/80 text-xs font-medium">Y así de fácil podés autogestionar tu negocio.</p>
            </div>
          </div>
        </div>
      
      </section>

      {/* --- SECCIÓN 3: PARA EL DUEÑO (ID: features) --- */}
      <section id="features" className="py-20 px-6 overflow-hidden scroll-mt-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            {/* Imagen Admin */}
            <div className="relative order-2 lg:order-1 flex justify-center items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-slate-100 rounded-3xl rotate-3 transform -z-10"></div>
                <img src="/screenshots/screen3.png" alt="Panel Admin" className="rounded-xl shadow-xl border border-slate-200 w-[312px] relative z-10" />
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
                        <p className="text-slate-600 text-sm"><strong>Edición en vivo:</strong> Cambiá precios y descripciones y se actualizan al instante.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                        <p className="text-slate-600 text-sm"><strong>Control de Stock:</strong> Pausá platos con un clic para que nadie lo pida.</p>
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
                        <p className="text-xs text-slate-500 mt-1">Optimizado para funcionar rápido.</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-orange-500 mb-2">image</span>
                        <h4 className="font-bold text-slate-900">Fotos HD</h4>
                        <p className="text-xs text-slate-500 mt-1">Mostrá tus platos en alta calidad.</p>
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

      {/* --- SECCIÓN NUEVA: PARTNERS (ID: partners) --- */}
      <section id="partners" className="py-20 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Users className="w-3 h-3" /> Programa de Partners
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              ¿Tenés una agencia o consultora?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Sumá Devoys a tu cartera. Ofrecé tecnología de punta a tus clientes y generá ingresos recurrentes sin programar.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-10 text-slate-300">
               <div className="flex items-center gap-2">
                 <div className="p-1 bg-green-500/20 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-400" /></div>
                 <span>Panel multi-cliente</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="p-1 bg-green-500/20 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-400" /></div>
                 <span>Soporte prioritario</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="p-1 bg-green-500/20 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-400" /></div>
                 <span>Comisiones recurrentes</span>
               </div>
            </div>

<Link href="/reseller"> 
    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-10 h-14 rounded-full text-lg font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
      Quiero ser Partner
    </Button>
</Link>
        </div>
      </section>

      {/* --- SECCIÓN 5: FINAL CTA (ID: contact) --- */}
      <section id="contact" className="py-24 px-6 bg-orange-500 relative overflow-hidden scroll-mt-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">¿Listo para transformar tu restaurante?</h2>
              <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto font-medium">
                  Sumate a los cientos de locales que ya digitalizaron su carta. Empezá gratis hoy mismo.
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
          </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center text-sm">
          <p>© 2026 Devoys Software. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}
"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar"; // O usá una Navbar simplificada si preferís
import { CheckCircle2, Zap, ShieldCheck, TrendingUp, Globe, Smartphone } from "lucide-react";

export default function ResellerLanding() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* NAVBAR SIMPLIFICADA PARA PARTNERS */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="size-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-lg">handshake</span>
                </div>
                <span className="font-black text-xl tracking-tight text-white">Devoys <span className="text-purple-500">Partners</span></span>
            </Link>
            <div className="flex gap-4 items-center">
                <Link href="/login?role=partner" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Ya tengo cuenta
                </Link>
                <Link href="/login?role=partner" className="px-5 py-2.5 bg-white text-black hover:bg-slate-200 font-bold rounded-full text-sm transition-all">
                    Empezar Gratis
                </Link>
            </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Efectos de fondo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-widest mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Programa White Label 2026
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-8 text-white">
                Tu propia Software Factory.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Sin escribir código.</span>
            </h1>
            
            <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Vendé menús digitales con <strong className="text-white">TU MARCA</strong> a restaurantes y bares. Nosotros ponemos la tecnología, vos ponés el precio y te quedás con el 100% de la facturación.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login?role=partner" className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-all shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-1 flex items-center justify-center gap-2">
                    Crear mi Agencia
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                </Link>
                <a href="#modelo" className="px-8 py-4 bg-[#1A1A1A] border border-white/10 hover:bg-white/5 text-white font-bold rounded-full transition-all flex items-center justify-center">
                    Ver cómo funciona
                </a>
            </div>

            <p className="mt-8 text-xs text-slate-500 font-bold uppercase tracking-wide">
                SIN TARJETA DE CRÉDITO • SETUP EN 30 SEGUNDOS
            </p>
        </div>
      </section>

      {/* BENTO GRID DE BENEFICIOS */}
      <section id="modelo" className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">El negocio perfecto para<br/>Agencias y Freelancers.</h2>
                <p className="text-slate-400">Deja de vender servicios "por única vez". Construí una cartera de clientes que te paguen todos los meses (MRR).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CARD 1: MARCA BLANCA (Grande) */}
                <div className="md:col-span-2 bg-[#111] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    <div className="relative z-10">
                        <div className="size-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/10"><ShieldCheck className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Marca Blanca (White Label)</h3>
                        <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                            El panel de tus clientes llevará <strong>TU LOGO</strong> y tus colores. Ellos nunca sabrán que existe Devoys. Para ellos, vos sos el desarrollador estrella.
                        </p>
                    </div>
                    {/* Visual Abstracto */}
                    <div className="absolute right-[-20px] bottom-[-20px] bg-[#1A1A1A] border border-white/5 p-4 rounded-xl rotate-[-5deg] w-48 opacity-50 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-500">
                        <div className="h-8 w-8 bg-purple-500 rounded-lg mb-2"></div>
                        <div className="h-2 w-24 bg-slate-700 rounded mb-1"></div>
                        <div className="h-2 w-16 bg-slate-800 rounded"></div>
                    </div>
                </div>

                {/* CARD 2: PRECIOS */}
                <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 group hover:border-green-500/30 transition-colors">
                    <div className="size-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6 border border-green-500/10"><TrendingUp className="w-6 h-6" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Tu Precio</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Nosotros no cobramos comisiones. Vos definís cuánto cobrarle a tu cliente: $10, $50 o $100 USD mensuales. <strong>Todo es tuyo.</strong>
                    </p>
                </div>

                {/* CARD 3: TECH */}
                <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 group hover:border-blue-500/30 transition-colors">
                    <div className="size-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/10"><Globe className="w-6 h-6" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Dominio Propio</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Tus clientes tendrán una URL profesional y rápida. Olvidate de servidores, hosting o certificados SSL. Nosotros manejamos la infraestructura.
                    </p>
                </div>

                {/* CARD 4: GESTIÓN */}
                <div className="md:col-span-2 bg-[#111] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 relative z-10">
                             <div className="size-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/10"><Zap className="w-6 h-6" /></div>
                             <h3 className="text-2xl font-bold text-white mb-2">Panel Multi-Cliente</h3>
                             <p className="text-slate-400 text-sm leading-relaxed">
                                 Gestioná 1 o 100 restaurantes desde un solo lugar. Entrá a sus cuentas con un clic ("God Mode") para hacer cambios sin pedirles la contraseña.
                             </p>
                        </div>
                        {/* Visual UI */}
                         <div className="w-full md:w-1/2 bg-[#050505] rounded-xl border border-white/10 p-4 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                             <div className="flex gap-2 mb-4 border-b border-white/5 pb-2">
                                 <div className="size-3 rounded-full bg-red-500/20"></div>
                                 <div className="size-3 rounded-full bg-yellow-500/20"></div>
                                 <div className="size-3 rounded-full bg-green-500/20"></div>
                             </div>
                             <div className="space-y-2">
                                 <div className="h-8 bg-[#151515] rounded w-full border-l-2 border-purple-500"></div>
                                 <div className="h-8 bg-[#151515] rounded w-full border-l-2 border-slate-700"></div>
                                 <div className="h-8 bg-[#151515] rounded w-full border-l-2 border-slate-700"></div>
                             </div>
                         </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">¿Listo para escalar tu agencia?</h2>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/login?role=partner" className="px-12 py-5 bg-white text-black font-black rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                      Registrarme como Partner
                  </Link>
                  <a href="https://wa.me/5491100000000" target="_blank" className="px-12 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">chat</span>
                      Hablar con Soporte
                  </a>
              </div>
              <p className="mt-8 text-sm text-slate-500">
                  Cupos limitados para el programa Beta 2026.
              </p>
          </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="py-12 text-center border-t border-white/5 bg-[#020202] text-slate-600 text-sm">
          <p>© 2026 Devoys Partners Program. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}
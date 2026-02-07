"use client";

import Link from "next/link";
import { 
  Wallet, 
  Briefcase, 
  Users, 
  Star, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

export default function ResellerLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="size-9 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-lg">handshake</span>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="font-black text-xl tracking-tight text-slate-900">Devoys</span>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Partners</span>
                </div>
            </Link>

            <div className="flex gap-4 items-center">
                <Link href="/login?role=partner" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors hidden md:block">
                    Ingresar
                </Link>
                <Link href="/login?role=partner" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    Empezar Ahora
                </Link>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Venta Pura) --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Decoración de fondo simple */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-50/80 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-8">
                🚀 Oportunidad de Negocio
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
                Sumá Menús Digitales<br/>
                <span className="text-orange-600">a tu catálogo de servicios.</span>
            </h1>
            
            <p className="text-slate-500 text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Ideal para Agencias, CMs y Diseñadores. Tus clientes gastronómicos ya están buscando modernizarse. <br className="hidden md:block"/>
                <strong>Dejá de regalarle ese negocio a otros.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login?role=partner" className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                    Quiero vender esto
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> 100% Ganancia tuya</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Sin saber programar</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Activación inmediata</span>
            </div>
        </div>
      </section>

      {/* --- POR QUÉ TE CONVIENE (Negocio) --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Un servicio más, <br/>un sueldo fijo extra.</h2>
                <p className="text-slate-500 text-lg">No es solo vender un menú. Es generar una relación a largo plazo con tus clientes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* CARD 1: PLATA */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="size-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Wallet className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Cobrá un abono mensual</h3>
                    <p className="text-slate-500 leading-relaxed">
                        A diferencia de un logo que cobrás una sola vez, el menú digital te permite cobrar un mantenimiento todos los meses. <strong>Asegurá tu flujo de caja.</strong>
                    </p>
                </div>

                {/* CARD 2: MARCA */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="size-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Todo con tu Logo</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Entregamos el sistema "limpio". Tu cliente va a ver <strong>TU AGENCIA</strong> cuando entre a gestionar sus precios. Quedás como un profesional tecnológico.
                    </p>
                </div>

                {/* CARD 3: FACILIDAD */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Fidelizá a tus clientes</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Si ya les manejás las redes o les hiciste el branding, esto es el complemento natural. Dales una solución completa y que no busquen a otro proveedor.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CÓMO ES EL PROCESO --- */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-slate-900 mb-4">Simple. Sin vueltas.</h2>
                  <p className="text-slate-500">No necesitás conocimientos técnicos. Si sabés usar Instagram, sabés usar esto.</p>
              </div>

              <div className="space-y-4">
                  {/* PASO 1 */}
                  <div className="flex md:items-center gap-6 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                      <div className="size-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Registrate como Partner</h3>
                          <p className="text-slate-500">Creá tu cuenta gratis. Accedés al panel donde vas a ver a todos tus clientes juntos.</p>
                      </div>
                  </div>

                  {/* PASO 2 */}
                  <div className="flex md:items-center gap-6 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                      <div className="size-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Creá un nuevo local</h3>
                          <p className="text-slate-500">Poné el nombre del restaurante y el mail del dueño. El sistema genera todo automático en 10 segundos.</p>
                      </div>
                  </div>

                  {/* PASO 3 */}
                  <div className="flex md:items-center gap-6 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                      <div className="size-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Cobrale a tu cliente</h3>
                          <p className="text-slate-500">Vos le facturás directo a tu cliente el precio que quieras. Nosotros no intervenimos en tu cobro.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-20 px-6 bg-slate-900 text-white text-center">
          <div className="max-w-3xl mx-auto">
              <div className="size-16 bg-white/10 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 fill-current" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                  Empezá a vender hoy mismo.
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                  Sin costos de alta. Sin contratos raros. Solo ganancias para tu agencia.
              </p>
              
              <Link href="/login?role=partner" className="inline-block px-12 py-5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full text-lg shadow-lg hover:-translate-y-1 transition-all">
                  Crear Cuenta Gratis
              </Link>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 text-center bg-white border-t border-slate-100">
          <p className="text-sm text-slate-400 font-medium">© 2026 Devoys Partners. Potenciando agencias.</p>
      </footer>

    </div>
  );
}
"use client";

import Link from "next/link";
import { 
  Wallet, 
  Rocket, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Laptop,
  Smartphone
} from "lucide-react";

// --- CONFIGURACIÓN ---
const SUPABASE_URL = "https://zrweexxbhoigpcgbfuqf.supabase.co/storage/v1/object/public/menu-images"; 

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

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-50/80 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-8">
                🚀 Programa de Partners
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
                Monetizá tu cartera de <br/>
                <span className="text-orange-600">clientes gastronómicos.</span>
            </h1>
            
            <p className="text-slate-500 text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Ofrecé a tus bares y restaurantes la tecnología de menús digitales de <strong>Devoys</strong>. <br className="hidden md:block"/>
                Nosotros ponemos el software, vos generás la venta y te llevás la mayor parte.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login?role=partner" className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                    Quiero ser Partner
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Sin costo de entrada</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Alta inmediata</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Soporte incluido</span>
            </div>
        </div>
      </section>

      {/* --- EL NEGOCIO (Pricing Claro) --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Números Claros,<br/>Ganancia Real.</h2>
                <p className="text-slate-500 text-lg">Diseñamos un modelo donde <strong>vos ganás más que nosotros</strong>. Queremos que te convenga vender.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* CARD 1 */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-slate-100 px-4 py-1 rounded-bl-xl text-xs font-bold text-slate-500">PVP Sugerido</div>
                    <div className="size-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
                        <Wallet className="w-7 h-7" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">$30.000</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Por mes / cliente</p>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Es el precio de mercado que sugerimos cobrarle al restaurante por el servicio completo.
                    </p>
                </div>

                {/* CARD 2 (La Ganancia) */}
                <div className="bg-orange-600 p-8 rounded-[2rem] shadow-xl shadow-orange-500/20 transform md:-translate-y-4 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 bg-orange-700 px-4 py-1 rounded-bl-xl text-xs font-bold text-orange-200">Tu Ganancia</div>
                    <div className="size-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                        <Rocket className="w-7 h-7" />
                    </div>
                    <h3 className="text-5xl font-black mb-1">$20.000</h3>
                    <p className="text-xs font-bold text-orange-200 uppercase tracking-widest mb-4">Limpios para vos</p>
                    <p className="text-orange-100 leading-relaxed text-sm font-medium">
                        Por cada cliente activo, te quedan <strong>$20.000 todos los meses</strong>. Nosotros solo cobramos el costo operativo.
                    </p>
                </div>

                {/* CARD 3 (Costo) */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-slate-100 px-4 py-1 rounded-bl-xl text-xs font-bold text-slate-500">Costo Base</div>
                    <div className="size-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
                        <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">$10.000</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Costo Devoys</p>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Es lo único que nos pagás a nosotros por mantener el servidor, las imágenes y el soporte técnico.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CÓMO FUNCIONA (Paso a Paso) --- */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-slate-900 mb-4">¿Cómo es la operatoria?</h2>
                  <p className="text-slate-500">Simple. Vos sos la cara visible ante el cliente.</p>
              </div>

              <div className="space-y-4">
                  {/* PASO 1 */}
                  <div className="flex md:items-center gap-6 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                      <div className="size-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Conseguís el cliente</h3>
                          <p className="text-slate-500">Le ofrecés el menú digital a tu cartera actual o nuevos prospectos. Cerrás el trato con ellos.</p>
                      </div>
                  </div>

                  {/* PASO 2 */}
                  <div className="flex md:items-center gap-6 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                      <div className="size-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Lo das de alta en tu Panel</h3>
                          <p className="text-slate-500">Entrás a Devoys Partners, cargás los datos del local y se genera el menú automáticamente.</p>
                      </div>
                  </div>

                  {/* PASO 3 */}
                  <div className="flex md:items-center gap-6 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                      <div className="size-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Facturación</h3>
                          <p className="text-slate-500">Vos le cobrás los $30.000 (o lo que quieras) a tu cliente. A fin de mes, nosotros te cobramos solo los $10.000 de costo.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- NUEVO: VISUALIZACIÓN DEL PRODUCTO --- */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="order-2 lg:order-1">
                     {/* IMPORTANTE: Subí una imagen llamada 'mockup-responsive.png' a tu bucket.
                         Idealmente 1200x800px. Fondo transparente queda mejor.
                     */}
                     <img 
                        src={`${SUPABASE_URL}/mockup-responsive.png`} 
                        alt="Devoys en PC y Celular" 
                        className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                     />
                  </div>
                  <div className="order-1 lg:order-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                          <Laptop className="w-4 h-4" /> & <Smartphone className="w-4 h-4" />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                          Funciona perfecto en cualquier dispositivo.
                      </h2>
                      <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                          Tus clientes no tienen que descargar nada. El menú es una <strong>WebApp ultra rápida</strong> que se ve increíble en celulares Android, iPhone, tablets y computadoras.
                      </p>
                      <ul className="space-y-4">
                          <li className="flex items-center gap-3">
                              <div className="size-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600"><CheckCircle2 className="w-4 h-4"/></div>
                              <span className="font-bold text-slate-700">Carga en menos de 1 segundo</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <div className="size-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600"><CheckCircle2 className="w-4 h-4"/></div>
                              <span className="font-bold text-slate-700">Fotos en Alta Definición</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <div className="size-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600"><CheckCircle2 className="w-4 h-4"/></div>
                              <span className="font-bold text-slate-700">Panel de autogestión para el dueño</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-20 px-6 bg-slate-900 text-white text-center">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                  Empezá a vender hoy mismo.
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                  Sin contratos de permanencia. Creá tu cuenta de Partner y accedé al panel de gestión inmediatamente.
              </p>
              
              <Link href="/login?role=partner" className="inline-block px-12 py-5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full text-lg shadow-lg hover:-translate-y-1 transition-all">
                  Crear Cuenta de Partner
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
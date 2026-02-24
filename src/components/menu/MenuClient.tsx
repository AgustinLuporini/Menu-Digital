"use client";

import { useState, useEffect, useRef } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { supabase } from "@/lib/supabase"; 
import Footer from "../ui/Footer"; 

// --- INTERFACES ---
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MenuClientProps {
  products: Product[];
  categories: Category[];
}

export default function MenuClient({ products, categories }: MenuClientProps) {
  // Estados de Datos
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Animaciones y Refs
  const [parent] = useAutoAnimate();
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  // Estados WiFi
  const [wifiSettings, setWifiSettings] = useState({ ssid: '', password: '' });
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // --- EFECTOS ---
  useEffect(() => {
    // 1. Scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

      if (currentScrollY < 100) setIsVisible(true);
      else if (currentScrollY > lastScrollY.current) setIsVisible(false);
      else setIsVisible(true);
      
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. WiFi
    const fetchWifi = async () => {
        const { data } = await supabase.from('restaurant_settings').select('wifi_ssid, wifi_password').single();
        if (data && data.wifi_ssid) {
            setWifiSettings({ ssid: data.wifi_ssid, password: data.wifi_password });
        }
    };
    fetchWifi();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helpers
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtrado
  const filteredProducts = selectedCategoryId 
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;

  const hasWifi = wifiSettings.ssid && wifiSettings.ssid.trim() !== "";

  return (
    <>
      {/* --- BOTÓN WIFI FLOTANTE --- */}
      {hasWifi && (
        <button
            onClick={() => setIsWifiModalOpen(true)}
            className="fixed bottom-6 left-6 z-40 bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 text-white size-12 rounded-full flex items-center justify-center shadow-xl shadow-black/50 hover:bg-primary hover:border-primary transition-all animate-bounce-in"
            style={{ animationDuration: '0.5s' }}
        >
            <span className="material-symbols-outlined text-[24px]">wifi</span>
        </button>
      )}

      {/* --- NAVBAR STICKY (ESTILO PASTILLAS) --- */}
      <nav 
        className={`
          w-full border-b border-white/5 
          sticky top-[61px] z-40 
          bg-[#101922]
          -mt-[1px]
          py-3 /* Un poco más de padding vertical para las pastillas */
          transition-transform duration-300 ease-in-out will-change-transform
          ${isVisible ? "translate-y-0" : "-translate-y-[200%] pointer-events-none"}
        `}
      >
        <div className="relative w-full">
            
            {/* Scroll Container */}
            <div className="flex overflow-x-auto hide-scrollbar w-full px-4 scroll-smooth">
                <div className="flex min-w-full w-fit justify-start md:justify-center gap-3">
                    {/* Botón TODOS */}
                    <button
                        onClick={() => setSelectedCategoryId(null)}
                        className={`
                            px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap border
                            ${selectedCategoryId === null
                                ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-105" // Activo: Blanco brillante
                                : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white" // Inactivo: Gris sutil
                            }
                        `}
                    >
                        Todos
                    </button>
                    
                    {/* Botones CATEGORÍAS */}
                    {categories.map((cat) => {
                    const isActive = cat.id === selectedCategoryId;
                    return (
                        <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`
                            px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap border
                            ${isActive
                                ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-105"
                                : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white"
                            }
                        `}
                        >
                            {cat.name}
                        </button>
                    );
                    })}
                    
                    {/* Espaciador final */}
                    <div className="w-8 shrink-0 md:hidden"></div>
                </div>
            </div>

            {/* --- INDICADOR DE SCROLL + FLECHA --- */}
            {/* Degradado negro con una flechita sutil para indicar "más a la derecha" */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#101922] via-[#101922] to-transparent pointer-events-none z-10 md:hidden flex items-center justify-end pr-1">
                <span className="material-symbols-outlined text-white/50 text-xl animate-pulse">chevron_right</span>
            </div>
        </div>
      </nav>

      {/* --- LISTA DE PRODUCTOS --- */}
<div className="divide-y divide-white/5 flex-1 w-full pt-4" ref={parent}>
  {filteredProducts.map((product) => (
    <div 
      key={product.id} 
      onClick={() => setSelectedProduct(product)}
      className="px-6 py-6 hover:bg-white/5 transition-colors cursor-pointer group active:bg-white/10"
    >
      <div className="flex items-start gap-5">
        {/* IMAGEN GRANDE */}
        <div 
          className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-xl shrink-0 border border-white/10 group-hover:border-accent/50 transition-colors bg-slate-800 shadow-lg" 
          style={{ backgroundImage: `url("${product.image_url}")` }} 
        ></div>
        
        <div className="flex flex-1 flex-col justify-between min-w-0 h-24 py-1">
          <div>
              <h3 className="text-white text-[17px] font-bold leading-tight mb-1.5 group-hover:text-accent transition-colors truncate pr-2">
              {product.name}
              </h3>
              <p className="text-slate-400 text-[13px] font-normal leading-snug line-clamp-2">
              {product.description}
              </p>
          </div>
          
          <div className="flex flex-col items-end mt-auto">
              {/* PRECIO FINAL */}
              <p className="text-accent text-[16px] font-bold tracking-tight">
                ${product.price.toLocaleString("es-AR")}
              </p>
              
              {/* PRECIO SIN IMPUESTOS (NUEVO) */}
              {product.price_without_tax ? (
                <p className="text-orange-400/90 text-[11px] font-medium mt-0.5 tracking-wide">
                  Sin impuestos: ${Number(product.price_without_tax).toLocaleString("es-AR")}
                </p>
              ) : null}
          </div>
        </div>
      </div>
    </div>
  ))}
  
  {filteredProducts.length === 0 && (
      <div className="py-20 text-center text-slate-500 text-sm flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">restaurant_menu</span>
          No hay productos en esta categoría.
      </div>
  )}
</div>

    {/* --- MODAL DE PRODUCTO --- */}
{selectedProduct && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedProduct(null)}>
        <div 
            className="bg-[#1A1A1A] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
            {/* BOTÓN X CORREGIDO */}
            <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/80 text-white rounded-full border border-white/20 backdrop-blur-md hover:bg-black hover:scale-105 transition-all shadow-lg"
            >
                <span className="material-symbols-outlined text-lg leading-none">close</span>
            </button>

            <div 
                className="w-full h-80 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${selectedProduct.image_url}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent"></div>
            </div>

            <div className="p-8 -mt-6 relative bg-[#1A1A1A] rounded-t-[2rem]">
                <div className="flex justify-center -mt-14 mb-6">
                    {/* BADGE DE CATEGORÍA CORREGIDO */}
                    {/* Opción 1: Fondo Acento con texto oscuro (ideal si tu accent es claro) */}
                    <span className="px-4 py-1.5 bg-accent text-slate-900 border border-black/10 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-lg">
                        {categories.find(c => c.id === selectedProduct.category_id)?.name}
                    </span>
                    
                    {/* Opción 2 (Descomentá esta si querés fondo oscuro y texto color acento): 
                    <span className="px-4 py-1.5 bg-[#2A2A2A] text-accent border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        {categories.find(c => c.id === selectedProduct.category_id)?.name}
                    </span> 
                    */}
                </div>
                
                <h3 className="text-3xl font-black text-white leading-tight mb-4 text-center">
                    {selectedProduct.name}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed mb-8 text-center text-opacity-90">
                    {selectedProduct.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Precio</span>
                    <span className="text-4xl font-black text-accent tracking-tight">
                        ${selectedProduct.price.toLocaleString("es-AR")}
                    </span>
                </div>
            </div>
        </div>
    </div>
)}

      {/* --- MODAL WIFI --- */}
      {isWifiModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1A1A1A] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative">
                <button onClick={() => setIsWifiModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white bg-white/5 rounded-full p-2 transition-colors"><span className="material-symbols-outlined text-sm">close</span></button>
                <div className="p-8 text-center">
                    <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(19,127,236,0.3)]"><span className="material-symbols-outlined text-3xl text-primary">wifi</span></div>
                    <h3 className="text-xl font-black text-white mb-1">Conectate al WiFi</h3>
                    <p className="text-slate-400 text-xs mb-6">Copiá la clave y navegá gratis.</p>
                    <div className="space-y-3">
                        <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                            <div className="text-left"><p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Red</p><p className="text-white font-medium text-sm truncate max-w-[150px]">{wifiSettings.ssid}</p></div>
                            <button onClick={() => copyToClipboard(wifiSettings.ssid, 'ssid')} className="p-2 bg-white/5 rounded-lg hover:bg-primary transition-colors group"><span className="material-symbols-outlined text-slate-400 group-hover:text-white text-lg">{copiedField === 'ssid' ? 'check' : 'content_copy'}</span></button>
                        </div>
                        <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                            <div className="text-left"><p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Contraseña</p><p className="text-white font-medium text-sm tracking-wider truncate max-w-[150px]">{wifiSettings.password}</p></div>
                            <button onClick={() => copyToClipboard(wifiSettings.password, 'pass')} className="p-2 bg-white/5 rounded-lg hover:bg-primary transition-colors group"><span className="material-symbols-outlined text-slate-400 group-hover:text-white text-lg">{copiedField === 'pass' ? 'check' : 'content_copy'}</span></button>
                        </div>
                    </div>
                    {copiedField && (<div className="mt-4 h-4"><p className="text-primary text-[10px] font-bold animate-pulse uppercase tracking-wide">¡Copiado al portapapeles!</p></div>)}
                </div>
            </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <Footer wifiSettings={wifiSettings} onOpenWifi={() => setIsWifiModalOpen(true)} />
    </>
  );
}
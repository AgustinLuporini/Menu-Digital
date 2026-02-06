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

  const currentCategoryName = categories.find(c => c.id === selectedCategoryId)?.name || "Nuestra Carta";
  const currentCategoryDesc = selectedCategoryId 
    ? `Nuestras opciones de ${currentCategoryName.toLowerCase()}.` 
    : "Seleccioná una categoría para comenzar.";

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

      {/* --- NAVBAR STICKY (LÓGICA HÍBRIDA: CENTER + SCROLL) --- */}
      <nav 
        className={`
          w-full border-b border-white/5 
          sticky top-[61px] z-40 bg-[#101922]/95 backdrop-blur-md 
          transition-transform duration-300 ease-in-out will-change-transform
          overflow-x-auto hide-scrollbar
          ${isVisible ? "translate-y-0" : "-translate-y-[200%] pointer-events-none"}
        `}
      >
        {/* SOLUCIÓN TÉCNICA:
            - min-w-full: Asegura que el contenedor ocupe al menos toda la pantalla (para poder centrar si son pocos items).
            - w-fit: Permite que el contenedor crezca más allá de la pantalla si hay muchos items (habilitando el scroll del padre).
            - justify-center: Centra los items dentro de este contenedor.
        */}
        <div className="flex min-w-full w-fit justify-center px-6 gap-8">
            <button
                onClick={() => setSelectedCategoryId(null)}
                className={`flex flex-col items-center justify-center border-b-2 pb-2 pt-1 whitespace-nowrap transition-all duration-300 ${
                selectedCategoryId === null
                    ? "border-accent text-accent text-glow"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
            >
                <span className="text-[10px] font-bold uppercase tracking-widest">Todos</span>
            </button>
            
            {categories.map((cat) => {
            const isActive = cat.id === selectedCategoryId;
            return (
                <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex flex-col items-center justify-center border-b-2 pb-2 pt-1 whitespace-nowrap transition-all duration-300 ${
                    isActive
                    ? "border-accent text-accent text-glow"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
                >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    {cat.name}
                </span>
                </button>
            );
            })}
        </div>
      </nav>

      {/* --- HEADER CATEGORÍA --- */}
      <div className="px-6 pt-6 pb-2 text-center">
        <h2 className="text-xl font-bold text-white mb-0.5 animate-fade-in">
          {currentCategoryName}
        </h2>
        <p className="text-[12px] text-slate-500 font-medium">
          {currentCategoryDesc}
        </p>
      </div>

      {/* --- LISTA DE PRODUCTOS --- */}
      <div className="divide-y divide-white/5 flex-1 w-full" ref={parent}>
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)}
            className="px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer group active:bg-white/10"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10 group-hover:border-accent/50 transition-colors bg-slate-800" 
                style={{ backgroundImage: `url("${product.image_url}")` }} 
              ></div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <h3 className="text-white text-[15px] font-bold leading-tight mb-0.5 group-hover:text-accent transition-colors truncate pr-2">
                  {product.name}
                </h3>
                <p className="text-slate-400 text-[12px] font-normal leading-snug line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-accent text-[15px] font-bold tracking-tight">
                  ${product.price.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
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
                <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 backdrop-blur-md hover:bg-black/70 transition-all"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
                <div 
                    className="w-full h-64 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${selectedProduct.image_url}')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent"></div>
                </div>
                <div className="p-8 -mt-10 relative">
                    <div className="mb-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {categories.find(c => c.id === selectedProduct.category_id)?.name}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-2">
                        {selectedProduct.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {selectedProduct.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Precio</span>
                        <span className="text-3xl font-black text-accent tracking-tight">
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
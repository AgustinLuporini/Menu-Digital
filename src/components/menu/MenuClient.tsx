"use client";

import { useState, useEffect, useRef } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [parent] = useAutoAnimate();
  
  // ESTADO PARA VISIBILIDAD
  const [isVisible, setIsVisible] = useState(true);
  
  // USAMOS REF PARA GUARDAR LA POSICIÓN (No provoca re-renders innecesarios)
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Umbral de seguridad: no hacer nada si el scroll es muy cortito (evita rebotes)
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) {
        return;
      }

      // Lógica:
      // 1. Si estamos muy arriba (< 100px), mostrar siempre.
      // 2. Si bajamos (current > last), ocultar.
      // 3. Si subimos (current < last), mostrar.
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false); // Bajando -> Ocultar
      } else {
        setIsVisible(true);  // Subiendo -> Mostrar
      }

      // Guardamos la posición actual para la próxima comparación
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // El array vacío [] asegura que el evento se cree una sola vez.

  const filteredProducts = selectedCategoryId 
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;

  const currentCategoryName = categories.find(c => c.id === selectedCategoryId)?.name || "Nuestra Carta";
  const currentCategoryDesc = selectedCategoryId 
    ? `Nuestras opciones de ${currentCategoryName.toLowerCase()}.` 
    : "Seleccioná una categoría para comenzar.";

  return (
    <>
      {/* NAVBAR STICKY
         - top-[61px]: Un pixel más que el header para que no se superpongan mal.
         - transition-transform: Suaviza la entrada/salida.
         - translate-y-0: Posición normal.
         - -translate-y-[200%]: Se va para arriba (se esconde detrás del header).
      */}
      <nav 
        className={`flex overflow-x-auto hide-scrollbar px-6 gap-8 border-b border-white/5 
          sticky top-[61px] z-40 bg-[#101922]/95 backdrop-blur-md transition-transform duration-300 ease-in-out will-change-transform
          ${isVisible ? "translate-y-0" : "-translate-y-[200%] pointer-events-none"}
        `}
      >
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
      </nav>

      {/* Espaciador */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-bold text-white mb-0.5 animate-fade-in">
          {currentCategoryName}
        </h2>
        <p className="text-[12px] text-slate-500 font-medium">
          {currentCategoryDesc}
        </p>
      </div>

      <div className="divide-y divide-white/5 min-h-[300px]" ref={parent}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10 group-hover:border-accent/50 transition-colors" 
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
      </div>
    </>
  );
}
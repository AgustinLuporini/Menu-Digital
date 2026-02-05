import { supabase } from "@/lib/supabase";
import MenuClient from "@/components/menu/MenuClient";
import Footer from "@/components/ui/Footer";

export const revalidate = 0;

export default async function MenuPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    // 1. Quitamos 'flex justify-center'. Dejamos bloque normal.
    <div className="min-h-screen bg-[#050505]"> 
      
      {/* 2. Agregamos 'mx-auto' para centrar el bloque. 
             Cambiamos 'md:max-w-md' por 'md:w-[450px]' (ancho fijo) para eliminar cualquier duda de flexibilidad. */}
      <main className="w-full md:w-[450px] mx-auto bg-[#101922] min-h-screen shadow-2xl relative md:border-x md:border-white/5 flex flex-col overflow-x-hidden">
        
        <header className="sticky top-0 z-50 bg-[#101922]/95 backdrop-blur-md border-b border-white/5 shrink-0">
          <div className="flex items-center p-4 justify-center relative">
            <h1 className="text-lg font-bold tracking-[0.2em] text-white uppercase text-center">
              TU RESTAURANTE
            </h1>
          </div>
        </header>

        <div className="flex-1 w-full">
          <MenuClient 
            products={products || []} 
            categories={categories || []} 
          />
        </div>


        
      </main>
    </div>
  );
}
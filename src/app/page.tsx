import { supabase } from "@/lib/supabase";
import MenuClient from "@/components/menu/MenuClient";

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
    <div className="min-h-screen bg-[#050505]"> 
      
      {/* Main con flex-col para ocupar toda la altura */}
      <main className="min-h-screen bg-[#050505] pb-20 md:pb-0 flex flex-col">
        
        <header className="sticky top-0 z-50 bg-[#101922]/95 backdrop-blur-md border-b border-white/5 shrink-0">
          <div className="flex items-center p-4 justify-center relative">
            <h1 className="text-lg font-bold tracking-[0.2em] text-white uppercase text-center">
              TU RESTAURANTE
            </h1>
          </div>
        </header>

        {/* --- CORRECCIÓN AQUÍ --- */}
        {/* Agregamos 'flex flex-col' para que lo de adentro pueda usar flex-1 */}
        <div className="flex-1 w-full flex flex-col">
          <MenuClient 
            products={products || []} 
            categories={categories || []} 
          />
        </div>

      </main>
    </div>
  );
}
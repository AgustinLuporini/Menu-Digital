import { supabase } from "@/lib/supabase";
import MenuClient from "@/components/menu/MenuClient";
import { notFound } from "next/navigation";

export const revalidate = 0;

// CAMBIO IMPORTANTE: Definimos params como Promise
export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // CAMBIO IMPORTANTE: Usamos 'await' para descomprimir los params
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  console.log("--- DEBUG ---");
  console.log("Buscando restaurante:", slug);

  // 1. Buscamos el Restaurante
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    console.error("Restaurante no encontrado en DB");
    return notFound();
  }

  // 2. Buscamos Categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order', { ascending: true });

  // 3. Buscamos Productos
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('restaurant_id', restaurant.id)
    .order('price', { ascending: true });

  return (
    <div className="min-h-screen bg-[#050505]"> 
      <main className="min-h-screen bg-[#050505] pb-20 md:pb-0 flex flex-col">
        
        <header className="sticky top-0 z-50 bg-[#101922]/95 backdrop-blur-md border-b border-white/5 shrink-0">
          <div className="flex items-center p-4 justify-center relative">
            <h1 className="text-lg font-bold tracking-[0.2em] text-white uppercase text-center">
              {restaurant.name}
            </h1>
          </div>
        </header>

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
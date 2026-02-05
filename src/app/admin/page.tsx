import { supabase } from "@/lib/supabase"; // O ../../lib/supabase si usás ruta relativa
import AdminContent from "@/components/admin/AdminContent";
// Borrá el import de 'redirect' si querés, ya no se usa acá.

export const revalidate = 0;

export default async function AdminPage() {
  
  // --- BORRAMOS EL BLOQUEO DE ACÁ ---
  // El servidor no puede ver la sesión local, así que sacamos esto
  // para que no te expulse injustamente.
  
  // 1. Traer Productos (esto es público, así que anda bien)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Traer Categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <AdminContent 
      initialProducts={products || []} 
      categories={categories || []} 
    />
  );
}
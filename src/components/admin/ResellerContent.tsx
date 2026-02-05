"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRestaurantAndOwner } from "@/app/actions/create-restaurant"; // Importamos la acción

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  owner_id?: string;
};

export default function ResellerContent() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Cargar lista
  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");

      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setRestaurants(data);
      setIsLoading(false);
    };
    fetchRestaurants();
  }, [router]);

  // Manejo del formulario NUEVO
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    
    // Llamamos a la Server Action
    const result = await createRestaurantAndOwner(formData);

    if (result.success) {
        alert(result.message);
        setIsModalOpen(false);
        // Recargamos la página para ver el nuevo restaurante en la lista
        window.location.reload();
    } else {
        alert("Error: " + result.error);
    }
    setIsCreating(false);
  };

  if (isLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      
      <header className="max-w-6xl mx-auto flex justify-between items-end mb-12">
        <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Mis Clientes</h1>
            <p className="text-slate-400">Panel de Reseller • {restaurants.length} activos</p>
        </div>
        <div className="flex gap-4">
             <Link href="/" className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-sm font-bold transition-all">
                Volver al Home
             </Link>
             <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 rounded-full bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                Nuevo Cliente
             </button>
        </div>
      </header>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((rest) => (
            <div key={rest.id} className="bg-[#101010] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="size-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-white/5">
                        <span className="material-symbols-outlined text-white">storefront</span>
                    </div>
                    {/* Botón para entrar como Admin (Ojo: esto ahora requiere que TU usuario sea owner o superadmin) */}
                    <Link href={`/admin?id=${rest.id}`} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined">settings</span>
                    </Link>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{rest.name}</h3>
                <p className="text-slate-500 text-xs mb-6 font-mono">/{rest.slug}</p>
                
                {/* Indicador de si tiene dueño asignado */}
                <div className="text-[10px] uppercase font-bold tracking-wider mb-4">
                    {rest.owner_id ? <span className="text-green-500">Usuario Asignado</span> : <span className="text-red-500">Sin Usuario</span>}
                </div>

                <div className="mt-auto border-t border-white/5 pt-4">
                    <a href={`/${rest.slug}`} target="_blank" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mb-2">
                        Ver Menú Público <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                    </a>
                </div>
            </div>
        ))}
      </div>

      {/* MODAL CREAR CON EMAIL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold mb-2">Nuevo Restaurante</h3>
                <p className="text-sm text-slate-400 mb-6">Se generará un usuario automáticamente.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Nombre del Bar</label>
                        <input name="name" type="text" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" required placeholder="Ej: Burger King" />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">URL (Slug)</label>
                        <input name="slug" type="text" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" required placeholder="Ej: burger-king" />
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <label className="text-xs uppercase font-bold text-primary mb-2 block">Email del Dueño</label>
                        <input name="email" type="email" className="w-full bg-black/30 border border-primary/30 rounded-xl p-4 text-white focus:border-primary" required placeholder="cliente@email.com" />
                        <p className="text-[10px] text-slate-500 mt-2">Password temporal: <strong>123456</strong></p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-400 hover:text-white">Cancelar</button>
                        <button type="submit" disabled={isCreating} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50">
                            {isCreating ? 'Creando...' : 'Crear Todo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
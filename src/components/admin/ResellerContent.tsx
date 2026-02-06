"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRestaurantAndOwner } from "@/app/actions/create-restaurant"; 

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
  const [userEmail, setUserEmail] = useState("");

  // Cargar lista
  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
          router.push("/login?role=partner");
          return;
      }
      setUserEmail(session.user.email || "");

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
        setIsModalOpen(false);
        // Recargamos para ver cambios (puedes optimizar esto luego actualizando el estado local)
        window.location.reload(); 
    } else {
        alert("Error: " + result.error);
    }
    setIsCreating(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login?role=partner");
  };

  if (isLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><div className="animate-spin size-8 border-4 border-purple-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 pb-20">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="material-symbols-outlined text-white text-xl">handshake</span>
                </div>
                <div>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block">Modo Partner</span>
                    <h1 className="text-lg font-black leading-none">Devoys Reseller</h1>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                 <div className="hidden md:block text-right">
                    <p className="text-xs text-slate-400">Logueado como</p>
                    <p className="text-sm font-bold text-white">{userEmail}</p>
                 </div>
                 <button onClick={handleLogout} className="size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-slate-400 hover:text-white">
                    <span className="material-symbols-outlined">logout</span>
                 </button>
             </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER CONTENIDO --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Mis Clientes</h1>
                <p className="text-slate-400 text-lg">Gestioná tus restaurantes y comisiones.</p>
            </div>
            <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all hover:scale-105">
                    <span className="material-symbols-outlined text-xl">add_business</span>
                    Nuevo Cliente
                </button>
            </div>
        </header>

        {/* --- STATS RÁPIDOS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#111] border border-white/5 p-5 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Clientes</p>
                <p className="text-3xl font-black text-white">{restaurants.length}</p>
            </div>
            <div className="bg-[#111] border border-white/5 p-5 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Activos</p>
                <p className="text-3xl font-black text-green-500">{restaurants.length}</p> {/* Placeholder */}
            </div>
        </div>

        {/* --- GRID DE RESTAURANTES --- */}
        {restaurants.length === 0 ? (
             <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5 border-dashed">
                 <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                     <span className="material-symbols-outlined text-3xl">storefront</span>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Aún no tenés clientes</h3>
                 <p className="text-slate-500 mb-6">Empezá a cargar tu cartera de restaurantes.</p>
                 <button onClick={() => setIsModalOpen(true)} className="text-purple-400 hover:text-purple-300 font-bold text-sm">Crear el primero</button>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((rest) => (
                    <div key={rest.id} className="bg-[#111] border border-white/5 p-6 rounded-3xl hover:border-purple-500/30 transition-all group flex flex-col relative overflow-hidden">
                        
                        {/* Header Card */}
                        <div className="flex justify-between items-start mb-5 relative z-10">
                            <div className="size-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                <span className="material-symbols-outlined text-slate-200 text-2xl">storefront</span>
                            </div>
                            
                            {/* Botón Admin (Solo visible si sos reseller/superadmin) */}
                            <Link href={`/admin?id=${rest.id}`} className="px-4 py-2 rounded-full bg-white/5 hover:bg-purple-600 hover:text-white flex items-center gap-2 text-xs font-bold text-slate-400 transition-all border border-white/5">
                                Gestionar
                                <span className="material-symbols-outlined text-sm">settings</span>
                            </Link>
                        </div>
                        
                        {/* Info */}
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{rest.name}</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">/{rest.slug}</span>
                            </div>
                            
                            {/* Status Usuario */}
                            <div className="mb-6 p-3 bg-[#0a0a0a] rounded-xl border border-white/5 flex items-center gap-3">
                                <div className={`size-2 rounded-full ${rest.owner_id ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Estado de Cuenta</p>
                                    <p className={`text-xs font-bold ${rest.owner_id ? 'text-white' : 'text-red-400'}`}>
                                        {rest.owner_id ? 'Usuario Asignado' : 'Sin Dueño Asignado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Card */}
                        <div className="mt-auto border-t border-white/5 pt-4 flex justify-between items-center relative z-10">
                            <a href={`/${rest.slug}`} target="_blank" className="text-xs font-bold text-slate-400 hover:text-purple-400 flex items-center gap-1 transition-colors">
                                Ver Menú Público <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                            </a>
                        </div>

                        {/* Decoración Hover */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- MODAL CREAR CLIENTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#111] w-full max-w-lg p-0 rounded-[2rem] border border-white/10 shadow-2xl shadow-black overflow-hidden">
                
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-[#151515] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Nuevo Cliente</h3>
                    <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><span className="material-symbols-outlined text-sm text-slate-400">close</span></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-2 block tracking-wider ml-1">Nombre del Local</label>
                            <input name="name" type="text" className="w-full bg-[#0a0a0a] border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl p-4 text-white placeholder:text-slate-700 transition-all outline-none" required placeholder="Ej: Burger King" />
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-2 block tracking-wider ml-1">URL Personalizada (Slug)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-bold">devoys.com/</span>
                                <input name="slug" type="text" className="w-full bg-[#0a0a0a] border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl p-4 pl-28 text-white placeholder:text-slate-700 transition-all outline-none" required placeholder="burger-king" />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-purple-500 text-lg">person_add</span>
                            <p className="text-sm font-bold text-purple-200">Datos del Dueño</p>
                        </div>
                        
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-2 block tracking-wider ml-1">Email del Cliente</label>
                            <input name="email" type="email" className="w-full bg-[#0a0a0a] border border-white/10 focus:border-purple-500 rounded-xl p-4 text-white outline-none transition-all" required placeholder="cliente@email.com" />
                        </div>
                        <div className="mt-3 flex gap-2 items-center">
                            <span className="material-symbols-outlined text-slate-500 text-sm">key</span>
                            <p className="text-xs text-slate-500">Contraseña temporal automática: <code className="text-white bg-white/10 px-1 py-0.5 rounded">123456</code></p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-white transition-colors">Cancelar</button>
                        <button type="submit" disabled={isCreating} className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100">
                            {isCreating ? 'Creando...' : 'Crear Restaurante'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
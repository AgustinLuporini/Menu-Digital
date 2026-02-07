"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRestaurantAndOwner } from "@/app/actions/create-restaurant"; 
import { Store, User, LogOut, Plus, Settings, ExternalLink, X, Key, Mail } from "lucide-react"; // Usando Lucide para iconos más limpios, o podés seguir con material symbols si preferís

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

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin size-8 border-4 border-orange-600 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 pb-20">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="size-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
                    <Store className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest block">Modo Partner</span>
                    <h1 className="text-lg font-black leading-none text-slate-900">Devoys Dashboard</h1>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                 <div className="hidden md:block text-right">
                    <p className="text-xs text-slate-400 font-medium">Logueado como</p>
                    <p className="text-sm font-bold text-slate-700">{userEmail}</p>
                 </div>
                 <button onClick={handleLogout} className="size-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500 hover:text-orange-600">
                    <LogOut className="w-5 h-5" />
                 </button>
             </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER CONTENIDO --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-slate-900">Mis Clientes</h1>
                <p className="text-slate-500 text-lg">Gestioná tus restaurantes y comisiones.</p>
            </div>
            <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5">
                    <Plus className="w-5 h-5" />
                    Nuevo Cliente
                </button>
            </div>
        </header>

        {/* --- STATS RÁPIDOS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Clientes</p>
                <p className="text-3xl font-black text-slate-900">{restaurants.length}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Activos</p>
                <p className="text-3xl font-black text-green-600">{restaurants.length}</p> 
            </div>
             {/* Stats Placeholder para rellenar (Opcional) */}
             <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm opacity-50">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Ganancia Est.</p>
                <p className="text-3xl font-black text-slate-900">$ --</p> 
            </div>
             <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm opacity-50">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Próx. Cobro</p>
                <p className="text-3xl font-black text-slate-900">--</p> 
            </div>
        </div>

        {/* --- GRID DE RESTAURANTES --- */}
        {restaurants.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                 <div className="size-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                     <Store className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Aún no tenés clientes</h3>
                 <p className="text-slate-500 mb-6">Empezá a cargar tu cartera de restaurantes.</p>
                 <button onClick={() => setIsModalOpen(true)} className="text-orange-600 hover:text-orange-700 font-bold text-sm hover:underline">Crear el primero</button>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((rest) => (
                    <div key={rest.id} className="bg-white border border-slate-200 p-6 rounded-3xl hover:border-orange-300 hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
                        
                        {/* Header Card */}
                        <div className="flex justify-between items-start mb-5 relative z-10">
                            <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400">
                                <Store className="w-7 h-7" />
                            </div>
                            
                            {/* Botón Admin */}
                            <Link href={`/admin?id=${rest.id}`} className="px-4 py-2 rounded-full bg-slate-50 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2 text-xs font-bold text-slate-500 transition-all border border-slate-100">
                                Gestionar
                                <Settings className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        
                        {/* Info */}
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{rest.name}</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-mono font-medium">/{rest.slug}</span>
                            </div>
                            
                            {/* Status Usuario */}
                            <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                <div className={`size-2.5 rounded-full ${rest.owner_id ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estado de Cuenta</p>
                                    <p className={`text-xs font-bold ${rest.owner_id ? 'text-slate-700' : 'text-red-500'}`}>
                                        {rest.owner_id ? 'Usuario Asignado' : 'Sin Dueño Asignado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Card */}
                        <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center relative z-10">
                            <a href={`/${rest.slug}`} target="_blank" className="text-xs font-bold text-slate-400 hover:text-orange-600 flex items-center gap-1 transition-colors">
                                Ver Menú Público <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- MODAL CREAR CLIENTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg p-0 rounded-[2rem] shadow-2xl overflow-hidden">
                
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Nuevo Cliente</h3>
                    <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-2 block tracking-wider ml-1">Nombre del Local</label>
                            <input 
                                name="name" 
                                type="text" 
                                className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 text-slate-900 placeholder:text-slate-400 transition-all outline-none" 
                                required 
                                placeholder="Ej: Burger King" 
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-2 block tracking-wider ml-1">URL Personalizada (Slug)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">devoys.com/</span>
                                <input 
                                    name="slug" 
                                    type="text" 
                                    className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 pl-28 text-slate-900 placeholder:text-slate-400 transition-all outline-none" 
                                    required 
                                    placeholder="burger-king" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-orange-600" />
                            <p className="text-sm font-bold text-orange-800">Datos del Dueño</p>
                        </div>
                        
                        <div className="mb-3">
                            <label className="text-xs uppercase font-bold text-slate-500 mb-2 block tracking-wider ml-1">Email del Cliente</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    name="email" 
                                    type="email" 
                                    className="w-full bg-white border border-slate-200 focus:border-orange-500 rounded-xl p-4 pl-10 text-slate-900 outline-none transition-all placeholder:text-slate-400" 
                                    required 
                                    placeholder="cliente@email.com" 
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Key className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs text-slate-500">Contraseña temporal: <code className="text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded font-mono font-bold">123456</code></p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancelar</button>
                        <button 
                            type="submit" 
                            disabled={isCreating} 
                            className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                        >
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
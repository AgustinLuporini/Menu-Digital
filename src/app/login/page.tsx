"use client";

import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Logueamos en Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 2. CONSULTAMOS EL ROL EN LA BASE DE DATOS
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.error("Error fetching profile:", profileError);
            router.push("/admin");
            return;
        }

// 3. EL PORTERO
        if (profile?.role === 'reseller') {
            // ANTES: router.push("/reseller");
            // AHORA:
            router.push("/reseller/dashboard"); 
        } else {
            router.push("/admin");
        }
      }
    } catch (error: any) {
      setErrorMsg("Credenciales incorrectas o error de conexión.");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos visuales (Partners vs Clientes)
  const isPartner = roleParam === 'partner';
  
  // Título e Ícono
  const themeTitle = isPartner ? 'Acceso Partners' : '¡Hola de nuevo!';
  const themeIcon = isPartner ? 'handshake' : 'restaurant'; 
  
  // Colores Dinámicos (Partner = Violeta / Dueño = Naranja Devoys)
  const bgButton = isPartner 
    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 text-white' 
    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 text-white';
    
  const iconContainerClass = isPartner 
    ? 'bg-purple-50 text-purple-600 shadow-purple-100' 
    : 'bg-orange-50 text-orange-600 shadow-orange-100';

  return (
    <div className="w-full max-w-[400px] bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 animate-fade-in relative z-10">
        
        <div className="text-center mb-10">
            <div className={`size-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${iconContainerClass} transition-all duration-500`}>
                <span className="material-symbols-outlined text-3xl">{themeIcon}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">{themeTitle}</h1>
            <p className="text-slate-500 text-sm font-medium">
                {isPartner ? 'Panel de control para revendedores.' : 'Ingresá para gestionar tu menú digital.'}
            </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium" 
                placeholder="tu@email.com" 
                required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium" 
                placeholder="••••••••" 
                required 
            />
          </div>
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-center animate-pulse">
                <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                <span className="text-red-600 text-xs font-bold">{errorMsg}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 ${bgButton}`}
          >
            {isLoading ? "Entrando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-100 pt-6">
            <button onClick={() => router.push('/')} className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto group">
                <span className="material-symbols-outlined text-[14px] group-hover:-translate-x-1 transition-transform">arrow_back</span> 
                Volver al inicio
            </button>
        </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans selection:bg-orange-100 relative overflow-hidden">
      
      {/* Fondos ambientales (Iguales a la Landing) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none"></div>

      <Suspense fallback={<div className="text-slate-400 font-bold text-sm animate-pulse">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
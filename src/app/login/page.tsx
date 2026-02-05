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
        // Ya no hardcodeamos nada. Buscamos en la tabla 'profiles'.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            // Si falla (ej: usuario viejo sin perfil), asumimos que es cliente normal
            console.error("Error fetching profile:", profileError);
            router.push("/admin");
            return;
        }

        // 3. EL PORTERO (Redirección basada en BD)
        if (profile?.role === 'reseller') {
            console.log("👑 Rol Reseller detectado.");
            router.push("/reseller");
        } else {
            console.log("👨‍🍳 Rol Owner detectado.");
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
  const themeTitle = isPartner ? 'Acceso Partners' : 'Bienvenido';
  const themeIcon = isPartner ? 'handshake' : 'storefront'; 
  const bgButton = isPartner ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20';
  const bgIcon = isPartner ? 'bg-purple-600 shadow-purple-500/20' : 'bg-blue-600 shadow-blue-500/20';

  return (
    <div className="w-full max-w-sm bg-[#101010] border border-white/10 p-8 rounded-[2rem] shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
            <div className={`size-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg ${bgIcon} transition-all duration-500`}>
                <span className="material-symbols-outlined text-2xl text-white">{themeIcon}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">{themeTitle}</h1>
            <p className="text-slate-500 text-xs mt-1">{isPartner ? 'Panel de control para revendedores.' : 'Ingresá para gestionar tu menú.'}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/20 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600" placeholder="nombre@ejemplo.com" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/20 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600" placeholder="••••••••" required />
          </div>
          {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold text-center animate-pulse">{errorMsg}</div>}
          <button type="submit" disabled={isLoading} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${bgButton}`}>{isLoading ? "Validando..." : "Ingresar"}</button>
        </form>

        <div className="mt-8 text-center">
            <button onClick={() => router.push('/')} className="text-xs text-slate-600 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto">
                <span className="material-symbols-outlined text-[10px]">arrow_back</span> Volver al inicio
            </button>
        </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 text-white font-sans selection:bg-primary/30">
      <Suspense fallback={<div className="text-slate-500 text-sm">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
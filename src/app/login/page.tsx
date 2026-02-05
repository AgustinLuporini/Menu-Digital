"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
    } else {
      // Si sale bien, nos manda al dashboard
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      
      {/* BRANDING */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black tracking-[0.2em] text-white uppercase mb-2">
          TU RESTAURANT
        </h1>
        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
          Panel de Gestión
        </p>
      </div>

      {/* TARJETA DE LOGIN */}
      <div className="w-full max-w-sm bg-[#101922] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Adorno visual (Glow top) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Email
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-600 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@devoys.com"
                className="w-full bg-[#0a1016] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-slate-700 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Contraseña
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-600 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a1016] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-slate-700 transition-all"
                required
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>INGRESAR</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

        </form>
      </div>

      {/* FOOTER */}
      <div className="mt-8 text-center opacity-40">
        <p className="text-[9px] text-slate-500 font-medium">
          POWERED BY <span className="font-bold">DEVOYS</span>
        </p>
      </div>

    </div>
  );
}
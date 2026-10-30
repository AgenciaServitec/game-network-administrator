'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${baseUrl}/` }
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden px-4 font-sans selection:bg-primary selection:text-black">

            <div className="absolute top-0 right-0 w-[55%] h-full bg-primary/10 blur-[150px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />

            <div className="relative z-10 w-full max-w-[440px]">

                <div className="flex justify-center mb-8">
                    <img src="/logo.png" alt="IM Shop" className="h-16 drop-shadow-[0_0_15px_rgba(250,204,21,0.2)]" />
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 flex flex-col relative overflow-hidden shadow-2xl">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-yellow-600" />

                    <div className="p-8 md:p-10">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-1 bg-primary rounded-full"></div>
                                <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px]">Acceso Restringido</p>
                            </div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                                IDENTIFICACIÓN <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">
                                    REQUERIDA
                                </span>
                            </h1>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full mb-8 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            <svg className="w-4 h-4 group-hover:hidden" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <svg className="w-4 h-4 hidden group-hover:block" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            AUTENTICAR CON GOOGLE
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Credenciales</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">
                                    CORREO ELECTRÓNICO
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="usuario@ejemplo.com"
                                        className="w-full pl-4 pr-12 py-3.5 bg-[#050505] border border-white/10 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white font-bold text-sm tracking-wide transition-all placeholder:text-zinc-700"
                                    />
                                    <Mail className="absolute right-4 top-4 text-zinc-600 w-4 h-4" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">
                                    CONTRASEÑA DE ACCESO
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-4 pr-12 py-3.5 bg-[#050505] border border-white/10 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white font-bold text-sm tracking-wide transition-all placeholder:text-zinc-700"
                                    />
                                    <Lock className="absolute right-4 top-4 text-zinc-600 w-4 h-4" />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 border border-red-500/30 bg-red-500/10 flex items-start gap-3">
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-4 bg-primary text-black font-black text-sm uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        {isSignUp ? 'CREAR CUENTA NUEVA' : 'INICIAR SESIÓN'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#050505] p-5 border-t border-white/5 flex flex-col items-center justify-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2"
                        >
                            <Zap className="w-3 h-3" />
                            {isSignUp ? '[ CAMBIAR A MODO INGRESO ]' : '[ SOLICITAR REGISTRO ]'}
                        </button>
                    </div>

                </div>

                <div className="mt-6 flex justify-center items-center gap-2 text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" /> Portal protegido por encriptación de 256 bits
                </div>
            </div>
        </div>
    );
}
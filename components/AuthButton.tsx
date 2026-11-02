'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${baseUrl}/dashboard`
            }
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <Link href="/admin" className="group flex bg-[#110f16] border-2 border-white/15 hover:border-primary px-5 py-2 -skew-x-12 transition-all duration-150 hover:-translate-y-0.5 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#ff2a1f]"
                >
                    <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full border border-primary/30"
                    />
                    <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-300 hidden sm:block">
                        ADMIN
                    </span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Cerrar sesión"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 bg-primary text-black text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:scale-105"
        >
            <LogIn className="w-4 h-4" /> Ingresar
        </button>
    );
}
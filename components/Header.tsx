import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import { Flame, Crosshair, Headset } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-[#070609]/95 backdrop-blur-md border-b-2 border-[#ff2a1f] sticky top-0 z-50 bg-halftone">
            <div className="w-full h-1 bg-gradient-to-r from-[#ff2a1f] via-[#ffb703] to-[#00e5ff]" />

            <div className="max-w-7xl mx-auto px-4 h-22 flex items-center justify-between relative">

                <Link href="/" className="flex items-center group relative py-2">
                    <div className="absolute -inset-2 bg-[#ff2a1f]/0 group-hover:bg-[#ff2a1f]/10 -skew-x-12 transition-all duration-200 border border-transparent group-hover:border-[#ff2a1f]/40" />
                    <img
                        src="/logo.png"
                        alt="IM Shop"
                        className="h-14 md:h-18 object-contain drop-shadow-[4px_4px_0px_#000000] group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-200 relative z-10"
                    />
                </Link>

                <div className="flex items-center gap-4 md:gap-6">
                    <nav className="hidden md:flex items-center gap-3">
                        <Link
                            href="/"
                            className="group relative bg-[#110f16] border-2 border-white/15 hover:border-primary px-5 py-2 -skew-x-12 transition-all duration-150 hover:-translate-y-0.5 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#ff2a1f]"
                        >
                            <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black text-zinc-300 group-hover:text-primary uppercase tracking-[0.2em]">
                                <Crosshair className="w-3.5 h-3.5 text-[#ff2a1f]" />
                                INICIO
                            </span>
                        </Link>

                        <Link
                            href="/#catalogo"
                            className="group relative bg-[#110f16] border-2 border-white/15 hover:border-primary px-5 py-2 -skew-x-12 transition-all duration-150 hover:-translate-y-0.5 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#ff2a1f]"
                        >
                            <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black text-zinc-300 group-hover:text-primary uppercase tracking-[0.2em]">
                                <Flame className="w-3.5 h-3.5 text-primary" />
                                CATÁLOGO
                            </span>
                        </Link>

                        <Link
                            href="#"
                            className="group relative bg-[#110f16] border-2 border-white/15 hover:border-[#00e5ff] px-5 py-2 -skew-x-12 transition-all duration-150 hover:-translate-y-0.5 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#00e5ff]"
                        >
                            <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black text-zinc-300 group-hover:text-[#00e5ff] uppercase tracking-[0.2em]">
                                <Headset className="w-3.5 h-3.5 text-[#00e5ff]" />
                                SOPORTE
                            </span>
                        </Link>
                    </nav>

                    <div className="relative pl-2 md:border-l-2 md:border-white/10">
                        <AuthButton />
                    </div>
                </div>

            </div>
        </header>
    );
}
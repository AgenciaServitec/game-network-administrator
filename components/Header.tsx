import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

                <Link href="/" className="flex items-center group">
                    <img
                        src="/logo.png"
                        alt="IM Shop"
                        className="h-16 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.15)] group-hover:scale-105 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.35)] transition-all duration-500"
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-2">
                    <Link
                        href="/"
                        className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                        INICIO
                    </Link>
                    <Link
                        href="/#catalogo"
                        className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                        CATÁLOGO
                    </Link>
                    <Link
                        href="#"
                        className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                        SOPORTE
                    </Link>
                </nav>
            </div>
        </header>
    );
}
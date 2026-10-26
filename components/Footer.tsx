import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/10 mt-auto pt-16 pb-8 relative overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-lg h-32 bg-primary/5 blur-3xl rounded-[100%] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start justify-between gap-12 mb-16 relative z-10">

                <div className="flex flex-col items-start max-w-sm">
                    <Link href="/" className="flex items-center group mb-6">
                        <img
                            src="/logo.png"
                            alt="IM Shop"
                            className="h-16 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.15)] group-hover:scale-105 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.35)] transition-all duration-500"
                        />
                    </Link>

                    <div className="border-l border-primary/50 pl-4">
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                            Recargas oficiales al instante. <br /> Domina el juego sin esperas.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Plataforma
                    </h4>
                    <Link href="/#catalogo" className="text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-primary hover:translate-x-1 transition-all duration-300">
                        Catálogo de Juegos
                    </Link>
                    <Link href="#" className="text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-primary hover:translate-x-1 transition-all duration-300">
                        Soporte Técnico
                    </Link>
                </div>

                {/* COLUMNA 3: LEGAL */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Legal
                    </h4>
                    <Link href="#" className="text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-primary hover:translate-x-1 transition-all duration-300">
                        Términos y Condiciones
                    </Link>
                    <Link href="#" className="text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-primary hover:translate-x-1 transition-all duration-300">
                        Políticas de Privacidad
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
                    © {new Date().getFullYear()} IM SHOP. TODOS LOS DERECHOS RESERVADOS.
                </p>

                <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]">
                    <Zap className="w-3 h-3" /> LIMA, PE
                </div>
            </div>
        </footer>
    );
}
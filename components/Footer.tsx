import Link from 'next/link';
import { Gamepad2, Terminal } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-background border-t-4 border-border mt-auto pt-16 pb-8 relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start justify-between gap-12 mb-16 relative z-10">

                <div className="flex flex-col items-start max-w-sm">
                    <Link href="/" className="flex items-center gap-4 group mb-6">
                        <div className="bg-primary text-black p-2 border-4 border-black shadow-[4px_4px_0px_#000] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                            <Gamepad2 className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <span className="text-3xl font-black text-foreground tracking-tighter uppercase mt-1">
                            IM <span className="text-primary">STORES</span>
                        </span>
                    </Link>

                    <div className="border-l-4 border-primary pl-4">
                        <p className="text-muted text-sm font-black uppercase tracking-widest leading-relaxed">
                            Recargas oficiales al instante. <br /> Domina el juego sin esperas.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-background bg-foreground px-2 py-1 font-black uppercase tracking-widest text-xs mb-2 inline-block self-start">
                        [ PLATAFORMA ]
                    </h4>
                    <Link href="/#catalogo" className="group flex items-center text-foreground text-xs font-bold uppercase tracking-widest transition-all">
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 text-primary font-black">{'> '}</span>
                        <span className="group-hover:text-primary transition-colors">Catálogo de Juegos</span>
                    </Link>
                    <Link href="#" className="group flex items-center text-foreground text-xs font-bold uppercase tracking-widest transition-all">
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 text-primary font-black">{'> '}</span>
                        <span className="group-hover:text-primary transition-colors">Soporte Técnico</span>
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-background bg-foreground px-2 py-1 font-black uppercase tracking-widest text-xs mb-2 inline-block self-start">
                        [ LEGAL ]
                    </h4>
                    <Link href="#" className="group flex items-center text-foreground text-xs font-bold uppercase tracking-widest transition-all">
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 text-primary font-black">{'> '}</span>
                        <span className="group-hover:text-primary transition-colors">Términos y Condiciones</span>
                    </Link>
                    <Link href="#" className="group flex items-center text-foreground text-xs font-bold uppercase tracking-widest transition-all">
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 text-primary font-black">{'> '}</span>
                        <span className="group-hover:text-primary transition-colors">Políticas de Privacidad</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 border-t-4 border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <p className="text-muted text-xs font-black uppercase tracking-widest text-center md:text-left">
                    © {new Date().getFullYear()} IM STORES. TODOS LOS DERECHOS RESERVADOS.
                </p>

                <div className="flex items-center gap-2 text-primary font-mono text-[10px] font-black uppercase tracking-widest">
                    <span>LIMA, PE</span>
                </div>
            </div>
        </footer>
    );
}
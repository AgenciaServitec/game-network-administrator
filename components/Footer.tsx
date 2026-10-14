import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-background border-t-2 border-border mt-auto pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start justify-between gap-12 mb-16">

                <div className="flex flex-col items-start max-w-sm">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Gamepad2 className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-black text-foreground tracking-tighter uppercase">
              STORE<span className="text-primary">GAMER</span>
            </span>
                    </Link>
                    <p className="text-muted text-sm font-bold uppercase tracking-widest leading-relaxed">
                        Recargas oficiales al instante. <br /> Domina el juego sin esperas.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-2">Plataforma</h4>
                    <Link href="/#catalogo" className="text-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Catálogo de Juegos
                    </Link>
                    <Link href="#" className="text-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Soporte Técnico
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-2">Legal</h4>
                    <Link href="#" className="text-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Términos y Condiciones
                    </Link>
                    <Link href="#" className="text-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Políticas de Privacidad
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 border-t-2 border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-muted text-xs font-bold uppercase tracking-widest text-center md:text-left">
                    © {new Date().getFullYear()} STOREGAMER. TODOS LOS DERECHOS RESERVADOS.
                </p>
            </div>
        </footer>
    );
}
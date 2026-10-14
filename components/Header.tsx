import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-background border-b-2 border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

                <Link href="/" className="flex items-center gap-2 group">
                    <Gamepad2 className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-black text-foreground tracking-tighter uppercase">
            STORE<span className="text-primary">GAMER</span>
          </span>
                </Link>

                <nav className="hidden md:flex gap-2">
                    <Link
                        href="/"
                        className="text-xs font-black text-foreground uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-black transition-colors"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/#catalogo"
                        className="text-xs font-black text-foreground uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-black transition-colors"
                    >
                        Catálogo
                    </Link>
                    <Link
                        href="#"
                        className="text-xs font-black text-foreground uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-black transition-colors"
                    >
                        Soporte
                    </Link>
                </nav>
            </div>
        </header>
    );
}
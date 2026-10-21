import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-background border-b-4 border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

                <Link href="/" className="flex items-center gap-4 group">
                    <div className="bg-primary text-black p-2 border-4 border-black shadow-[4px_4px_0px_#000] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                        <Gamepad2 className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <span className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase mt-1">
                        IM <span className="text-primary">SHOP</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    <Link
                        href="/"
                        className="text-xs font-black text-foreground uppercase tracking-widest px-5 py-3 border-4 border-transparent hover:border-black hover:bg-primary hover:text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all"
                    >
                        INICIO
                    </Link>
                    <Link
                        href="/#catalogo"
                        className="text-xs font-black text-foreground uppercase tracking-widest px-5 py-3 border-4 border-transparent hover:border-black hover:bg-primary hover:text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all"
                    >
                        CATÁLOGO
                    </Link>
                    <Link
                        href="#"
                        className="text-xs font-black text-foreground uppercase tracking-widest px-5 py-3 border-4 border-transparent hover:border-black hover:bg-primary hover:text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all"
                    >
                        SOPORTE
                    </Link>
                </nav>
            </div>
        </header>
    );
}
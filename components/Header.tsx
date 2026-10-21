import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-background border-b-4 border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

                <Link href="/" className="flex items-center group">
                    <img
                        src="/logo.png"
                        alt="IM Shop"
                        className="h-20 md:h-28 object-contain drop-shadow-[4px_4px_0px_#000] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:drop-shadow-none transition-all"
                    />
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
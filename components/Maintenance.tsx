import { HardHat, Wrench } from 'lucide-react';

export default function Maintenance() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
                <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping" />
                    <div className="relative bg-[#0a0a0a] border border-yellow-500/30 w-full h-full rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                        <Wrench className="w-10 h-10 text-yellow-400" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                    Sitio en <span className="text-yellow-400">Desarrollo</span>
                </h1>

                <p className="text-zinc-400 text-sm md:text-base font-medium mb-8 leading-relaxed">
                    Estamos preparando el motor de recargas automáticas de IM Shop.
                    Volveremos muy pronto con la mejor experiencia para tus compras de diamantes.
                </p>

                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400 text-xs font-bold uppercase tracking-widest">
                    <HardHat className="w-4 h-4" />
                    Acceso Restringido temporalmente
                </div>
            </div>
        </div>
    );
}
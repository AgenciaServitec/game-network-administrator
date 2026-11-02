'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, CheckCircle2, XCircle, Loader2, Gamepad2, ArrowLeft, ShieldCheck, Gem, Crown, Lock, Zap, Flame, Crosshair, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Package {
    code: string;
    name: string;
    price: number;
    originalPrice?: number;
}

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [localPlayerId, setLocalPlayerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [packages, setPackages] = useState<Package[]>([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [gameExists, setGameExists] = useState(true);

    const [activeTab, setActiveTab] = useState<'diamonds' | 'memberships'>('diamonds');

    const { nickname, productCode, price, setPlayer, setProduct } = useCartStore();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(`/api/packages?slug=${slug}`);
                const data = await res.json();

                if (data.success) {
                    setPackages(data.packages);
                } else {
                    setGameExists(false);
                }
            } catch (err) {
                console.error('Error cargando paquetes:', err);
                setGameExists(false);
            } finally {
                setLoadingPackages(false);
            }
        };
        fetchPackages();

        return () => useCartStore.getState().clearCart();
    }, [slug]);

    if (!gameExists) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-32 px-4 bg-[#070609] selection:bg-[#ff2a1f] selection:text-white min-h-[80vh] relative overflow-hidden bg-halftone">
                <div className="absolute inset-0 bg-speedlines pointer-events-none" />
                <div className="relative z-10 bg-[#110f16] border-2 border-[#ff2a1f] p-10 md:p-12 flex flex-col items-center max-w-xl text-center shadow-[8px_8px_0px_#ff2a1f]">
                    <div className="bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-5 mb-6 -skew-x-6">
                        <Gamepad2 className="w-14 h-14 text-[#ff2a1f] skew-x-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-5">
                        JUEGO EN <span className="text-primary">DESARROLLO</span>
                    </h1>
                    <div className="pl-4 border-l-4 border-primary mb-8 bg-black/40 py-2 pr-4 text-left">
                        <p className="text-zinc-300 font-medium text-sm leading-relaxed">
                            Estamos trabajando para integrar <strong className="text-white font-black">{slug.replace(/-/g, ' ').toUpperCase()}</strong> a nuestro catálogo automático pronto.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="group inline-flex items-center justify-center gap-3 bg-primary hover:bg-[#ffc42e] text-black font-black text-sm px-8 py-3.5 uppercase tracking-[0.18em] border-2 border-black shadow-[5px_5px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 stroke-[3]" /> VOLVER AL INICIO
                    </button>
                </div>
            </div>
        );
    }

    const validateId = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!localPlayerId) return;
        setLoading(true);
        setError('');
        useCartStore.getState().clearCart();

        try {
            const response = await fetch('/api/validate-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: localPlayerId, gameCode: 'freefire' }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setPlayer(localPlayerId, data.nickname);
            } else {
                const errorMessage = data.error?.toUpperCase() || '';
                if (errorMessage.includes('NOT ENABLED')) {
                    console.warn('Bypass de validación activo por bloqueo de Codestore');
                    setPlayer(localPlayerId, 'USUARIO_DE_PRUEBA');
                    return;
                }

                setError(data.error || 'No se pudo validar el ID');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: useCartStore.getState().playerId,
                    nickname,
                    productCode,
                    price: price
                }),
            });
            const data = await response.json();
            if (data.success && data.initPoint) {
                window.location.href = data.initPoint;
            } else {
                alert('Error al generar el pago: ' + (data.error || 'Intenta de nuevo'));
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
            setLoading(false);
        }
    };

    const isMembership = (code: string) => code.includes('weekly') || code.includes('monthly') || code.includes('pass');

    const diamondsPackages = packages
        .filter(pkg => !isMembership(pkg.code))
        .sort((a, b) => a.price - b.price);

    const membershipsPackages = packages
        .filter(pkg => isMembership(pkg.code))
        .sort((a, b) => a.price - b.price);

    const displayedPackages = activeTab === 'diamonds' ? diamondsPackages : membershipsPackages;

    return (
        <div className="w-full pb-32 bg-[#070609] selection:bg-[#ff2a1f] selection:text-white min-h-screen relative overflow-hidden font-sans bg-halftone">

            <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

            {/* Texto hueco de fondo */}
            <div className="absolute -top-4 left-4 lg:left-10 z-0 pointer-events-none select-none overflow-hidden">
                <span className="text-[6rem] sm:text-[10rem] lg:text-[14rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block">
                    RECARGA
                </span>
            </div>

            {/* Glows */}
            <div className="absolute top-40 right-[5%] w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full blur-[130px] pointer-events-none z-0 bg-gradient-to-tr from-[#ff2a1f]/30 via-[#ffb703]/20 to-[#00e5ff]/10" />

            {/* Barra superior */}
            <div className="w-full bg-[#0c0a10] border-b-2 border-[#1f1a29] py-3 relative z-20">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <Link href="/#catalogo" className="group flex items-center text-[11px] font-black uppercase tracking-[0.22em] text-zinc-300 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform text-[#ff2a1f] stroke-[3]" />
                        VOLVER AL CATÁLOGO
                    </Link>
                    <span className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" />
                        SISTEMA ANTI-BAN <strong className="text-[#00e5ff]">VERIFICADO</strong>
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 relative z-10">

                {/* Encabezado */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-white/10 pb-6">
                    <div>
                        <div className="inline-flex items-center gap-3 bg-[#120e17] border-2 border-[#ff2a1f] px-4 py-1.5 mb-5 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
                            <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-white">
                                <Crosshair className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                                RECARGA DIRECTA — <span className="text-primary">AL ID</span>
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-[5px_5px_0px_#000000]">
                            {slug.replace(/-/g, ' ')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a1f] via-[#ff6b00] to-[#ffb703]">ID</span>
                        </h1>
                    </div>
                    <div className="pl-5 border-l-4 border-primary max-w-sm bg-black/40 py-2 pr-4 backdrop-blur-xs">
                        <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed flex items-start gap-2">
                            <Zap className="w-4 h-4 text-primary mt-1 shrink-0" />
                            <span>Recarga oficial. <strong className="text-white font-black">Entrega instantánea</strong> en tu cuenta.</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Paso 1 */}
                    <div className="lg:col-span-5 h-full">
                        <div className="h-full bg-[#110f16] border-2 border-white/20 p-6 md:p-8 flex flex-col shadow-[6px_6px_0px_#1f1a29] relative overflow-hidden">

                            <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />

                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <div className="w-9 h-9 bg-primary text-black border-2 border-black shadow-[3px_3px_0px_#ff2a1f] -skew-x-6 flex items-center justify-center text-sm font-black">
                                    <span className="skew-x-6">1</span>
                                </div>
                                Verificación de ID
                            </h2>

                            <form onSubmit={validateId} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-400 mb-3 uppercase tracking-[0.25em]">
                                        ID del Jugador
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={localPlayerId}
                                            onChange={(e) => setLocalPlayerId(e.target.value)}
                                            placeholder="Ej: 123456789"
                                            className="w-full pl-5 pr-12 py-4 bg-[#070609] border-2 border-white/15 outline-none focus:border-primary focus:shadow-[4px_4px_0px_#ff2a1f] transition-all text-white font-black text-lg tracking-wider placeholder:text-zinc-700"
                                            disabled={loading}
                                        />
                                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="group w-full inline-flex items-center justify-center gap-3 py-4 bg-primary hover:bg-[#ffc42e] text-black font-black text-sm uppercase tracking-[0.18em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:hover:shadow-[6px_6px_0px_#ff2a1f] disabled:hover:translate-x-0 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
                                    disabled={!localPlayerId || loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <Flame className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
                                            Buscar Cuenta
                                            <ChevronRight className="w-5 h-5 stroke-[3]" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-8 p-4 border-2 border-[#ff2a1f] bg-[#ff2a1f]/10 flex items-start gap-4 shadow-[4px_4px_0px_#ff2a1f] animate-in fade-in">
                                    <XCircle className="w-5 h-5 text-[#ff2a1f] shrink-0 mt-0.5" />
                                    <p className="text-[11px] font-black text-[#ff6b60] uppercase tracking-widest mt-0.5 leading-relaxed">{error}</p>
                                </div>
                            )}

                            {nickname && (
                                <div className="mt-8 p-5 bg-[#00e5ff]/10 border-2 border-[#00e5ff] shadow-[4px_4px_0px_#00e5ff]/40 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-[#00e5ff]/15 border border-[#00e5ff]/40 p-2.5">
                                        <CheckCircle2 className="w-6 h-6 text-[#00e5ff]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#00e5ff] font-black uppercase tracking-[0.25em] mb-1">Cuenta Validada</p>
                                        <p className="text-xl font-black text-white tracking-tight uppercase">{nickname}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="lg:col-span-7 h-full">
                        <div className="h-full bg-[#110f16] border-2 border-white/20 p-6 md:p-8 flex flex-col shadow-[6px_6px_0px_#1f1a29] relative overflow-hidden">

                            <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff]" />

                            {!nickname && (
                                <div className="absolute inset-0 z-20 bg-[#070609]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in bg-halftone">
                                    <div className="bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-4 mb-4 -skew-x-6">
                                        <Lock className="w-7 h-7 text-[#ff2a1f] skew-x-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Desbloquea el Catálogo</h3>
                                    <p className="text-zinc-400 text-sm max-w-sm font-medium">Ingresa tu Player ID en el panel izquierdo para verificar tu cuenta y ver los paquetes disponibles.</p>
                                </div>
                            )}

                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4 relative z-10">
                                <div className={`w-9 h-9 border-2 -skew-x-6 flex items-center justify-center text-sm font-black transition-colors ${nickname ? 'bg-primary text-black border-black shadow-[3px_3px_0px_#ff2a1f]' : 'bg-white/5 border-white/15 text-zinc-500'}`}>
                                    <span className="skew-x-6">2</span>
                                </div>
                                Elige tu Paquete
                            </h2>

                            {/* Tabs */}
                            <div className="flex gap-2 bg-[#070609] border-2 border-white/15 p-1.5 mb-8 relative z-10">
                                <button
                                    onClick={() => setActiveTab('diamonds')}
                                    className={`flex-1 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer
                                        ${activeTab === 'diamonds' ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <Gem className="w-4 h-4" /> Diamantes
                                </button>
                                <button
                                    onClick={() => setActiveTab('memberships')}
                                    className={`flex-1 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer
                                        ${activeTab === 'memberships' ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <Crown className="w-4 h-4" /> Membresías
                                </button>
                            </div>

                            <div className="relative z-10 flex-1">
                                {loadingPackages ? (
                                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 bg-[#0a080d]">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                        <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando...</p>
                                    </div>
                                ) : displayedPackages.length === 0 ? (
                                    <div className="flex items-center justify-center py-20 border-2 border-dashed border-white/10 bg-[#0a080d]">
                                        <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                                            No hay paquetes disponibles.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-h-[450px] overflow-y-auto p-2 pr-3 custom-scrollbar">
                                        {displayedPackages.map((pkg) => {
                                            const selected = productCode === pkg.code;
                                            return (
                                                <button
                                                    key={pkg.code}
                                                    onClick={() => setProduct(pkg.code, pkg.price)}
                                                    className={`relative p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 group cursor-pointer
                                                        ${selected
                                                        ? 'border-primary bg-primary/10 shadow-[5px_5px_0px_#ff2a1f] -translate-x-1 -translate-y-1'
                                                        : 'border-white/20 bg-[#0a080d] shadow-[4px_4px_0px_#1f1a29] hover:border-primary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#ff2a1f]'}`}
                                                >
                                                    {selected && (
                                                        <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />
                                                    )}

                                                    <div className={`p-2.5 border transition-colors duration-200 ${selected ? 'text-primary bg-primary/15 border-primary/40' : 'text-zinc-400 bg-white/5 border-white/10 group-hover:text-primary'}`}>
                                                        {isMembership(pkg.code) ? <Crown className="w-7 h-7" /> : <Gem className="w-7 h-7" />}
                                                    </div>

                                                    <div className="text-center w-full">
                                                        <p className="font-black text-[11px] text-white uppercase tracking-wide mb-3 leading-tight h-8 flex items-center justify-center">
                                                            {pkg.name}
                                                        </p>

                                                        <div className="flex flex-col items-center justify-center bg-black/50 border border-white/10 py-2 w-full">
                                                            <p className={`text-lg font-black tracking-tight font-mono ${selected ? 'text-primary' : 'text-white'}`}>
                                                                S/ {pkg.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Checkout */}
                            <div className="pt-6 border-t-2 border-white/10 mt-auto relative z-10">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 lg:py-5 bg-[#009EE3] hover:bg-[#0089c4] text-white font-black text-sm md:text-base uppercase tracking-[0.15em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:shadow-[6px_6px_0px_#ff2a1f] disabled:hover:translate-x-0 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
                                    disabled={!productCode || loading}
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            PAGAR CON MERCADO PAGO
                                            {price > 0 && <span className="bg-black/30 border border-white/20 px-2 py-0.5 font-mono">S/ {price.toFixed(2)}</span>}
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center justify-center gap-2 mt-5 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
                                    Transacción procesada y encriptada por Mercado Pago
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
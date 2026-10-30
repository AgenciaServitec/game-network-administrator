'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, CheckCircle2, XCircle, Loader2, Gamepad2, ArrowLeft, ShieldCheck, Gem, Crown, Lock, Zap } from 'lucide-react';
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
    const [gameExists, setGameExists] = useState(true); // NUEVO: Estado para el mantenimiento dinámico

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
            <div className="w-full flex-1 flex flex-col items-center justify-center py-32 px-4 bg-[#050505] selection:bg-primary selection:text-black min-h-[80vh]">
                <div className="bg-[#0a0a0a] border border-white/10 p-12 rounded-3xl flex flex-col items-center max-w-xl text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
                    <Gamepad2 className="w-20 h-20 text-zinc-600 mb-6 relative z-10" />
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">
                        JUEGO EN <span className="text-primary">DESARROLLO</span>
                    </h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-10 relative z-10">
                        Estamos trabajando para integrar {slug.replace(/-/g, ' ').toUpperCase()} a nuestro catálogo automático pronto.
                    </p>
                    <button onClick={() => router.push('/')} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold tracking-widest flex items-center gap-3 transition-all relative z-10">
                        <ArrowLeft className="w-5 h-5" /> VOLVER AL INICIO
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
        <div className="w-full pb-32 bg-[#050505] selection:bg-primary selection:text-black min-h-screen relative overflow-hidden font-sans">

            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

            <div className="border-b border-white/5 py-4 relative z-20 bg-[#0a0a0a]/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 flex items-center">
                    <Link href="/#catalogo" className="group flex items-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform text-primary" />
                        VOLVER AL CATÁLOGO
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 relative z-10">

                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                            <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Recarga Directa</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                            {slug.replace(/-/g, ' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">ID</span>
                        </h1>
                        <p className="text-zinc-400 font-medium tracking-wide text-sm md:text-base mt-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" /> Recarga oficial. Entrega instantánea en tu cuenta.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-5 h-full">
                        <div className="h-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl relative overflow-hidden">

                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center text-sm shadow-[0_0_15px_rgba(250,204,21,0.15)]">1</div>
                                Verificación de ID
                            </h2>

                            <form onSubmit={validateId} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-3 uppercase tracking-widest">
                                        ID del Jugador
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={localPlayerId}
                                            onChange={(e) => setLocalPlayerId(e.target.value)}
                                            placeholder="Ej: 123456789"
                                            className="w-full pl-5 pr-12 py-4 bg-[#050505] border border-white/10 rounded-xl outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white font-bold text-lg tracking-wider placeholder:text-zinc-700"
                                            disabled={loading}
                                        />
                                        <Search className="absolute right-4 top-4.5 text-zinc-500 w-5 h-5" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary text-black rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(250,204,21,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                                    disabled={!localPlayerId || loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar Cuenta'}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-8 p-4 border border-red-500/30 bg-red-500/10 rounded-xl flex items-start gap-4 animate-in fade-in">
                                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-0.5 leading-relaxed">{error}</p>
                                </div>
                            )}

                            {nickname && (
                                <div className="mt-8 p-5 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-green-500/20 text-green-400 p-2.5 rounded-full">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-green-400/80 font-bold uppercase tracking-widest mb-1">Cuenta Validada</p>
                                        <p className="text-xl font-black text-white tracking-wide">{nickname}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7 h-full">
                        <div className="h-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl relative overflow-hidden">

                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />

                            {!nickname && (
                                <div className="absolute inset-0 z-20 bg-[#050505]/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                                    <div className="bg-white/5 border border-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-2xl">
                                        <Lock className="w-6 h-6 text-zinc-400" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 tracking-wide">Desbloquea el Catálogo</h3>
                                    <p className="text-zinc-400 text-sm max-w-sm">Ingresa tu Player ID en el panel izquierdo para verificar tu cuenta y ver los paquetes disponibles.</p>
                                </div>
                            )}

                            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-4 relative z-10">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-colors ${nickname ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_rgba(250,204,21,0.15)]' : 'bg-white/5 border-white/10 text-zinc-500'}`}>2</div>
                                Elige tu Paquete
                            </h2>

                            <div className="flex p-1 bg-[#050505] border border-white/10 rounded-xl mb-8 relative z-10">
                                <button
                                    onClick={() => setActiveTab('diamonds')}
                                    className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2
                                        ${activeTab === 'diamonds' ? 'bg-white/10 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                >
                                    <Gem className="w-4 h-4" /> Diamantes
                                </button>
                                <button
                                    onClick={() => setActiveTab('memberships')}
                                    className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2
                                        ${activeTab === 'memberships' ? 'bg-white/10 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                >
                                    <Crown className="w-4 h-4" /> Membresías
                                </button>
                            </div>

                            <div className="relative z-10 flex-1">
                                {loadingPackages ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary/50 mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Sincronizando...</p>
                                    </div>
                                ) : displayedPackages.length === 0 ? (
                                    <div className="flex items-center justify-center py-20 border border-dashed border-white/10 rounded-xl">
                                        <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                                            No hay paquetes disponibles.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                        {displayedPackages.map((pkg) => (
                                            <button
                                                key={pkg.code}
                                                onClick={() => setProduct(pkg.code, pkg.price)}
                                                className={`relative p-5 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 group
                                                    ${productCode === pkg.code
                                                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(250,204,21,0.1)]'
                                                    : 'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10'}`}
                                            >
                                                {productCode === pkg.code && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(250,204,21,1)]" />
                                                )}

                                                <div className={`transition-colors duration-300 ${productCode === pkg.code ? 'text-primary' : 'text-zinc-400 group-hover:text-primary/70'}`}>
                                                    {isMembership(pkg.code) ? <Crown className="w-8 h-8" /> : <Gem className="w-8 h-8" />}
                                                </div>

                                                <div className="text-center w-full">
                                                    <p className="font-bold text-xs text-white mb-2 leading-tight h-8 flex items-center justify-center">
                                                        {pkg.name}
                                                    </p>

                                                    <div className="flex flex-col items-center justify-center bg-black/30 rounded-lg py-2 w-full">
                                                        <p className={`text-lg font-black tracking-wide ${productCode === pkg.code ? 'text-primary' : 'text-white'}`}>
                                                            S/ {pkg.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/10 mt-auto relative z-10">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 lg:py-5 bg-[#009EE3] hover:bg-[#0089c4] text-white rounded-xl font-black text-sm md:text-base tracking-widest shadow-[0_0_20px_rgba(0,158,227,0.3)] hover:shadow-[0_0_30px_rgba(0,158,227,0.5)] transition-all hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                                    disabled={!productCode || loading}
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            PAGAR CON MERCADO PAGO
                                            {price > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-md">S/ {price.toFixed(2)}</span>}                                        </>
                                    )}
                                </button>
                                <div className="flex items-center justify-center gap-2 mt-5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
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
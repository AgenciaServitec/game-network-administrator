'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, CheckCircle2, XCircle, Loader2, Gamepad2, ArrowLeft, ShieldCheck, Gem, Crown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Card, Button } from '@/components/ui';

interface Package {
    code: string;
    name: string;
    price: number;
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

    const [activeTab, setActiveTab] = useState<'diamonds' | 'memberships'>('diamonds');

    const { nickname, productCode, setPlayer, setProduct } = useCartStore();

    useEffect(() => {
        if (slug !== 'free-fire') return;

        const fetchPackages = async () => {
            try {
                const res = await fetch('/api/packages');
                const data = await res.json();
                if (data.success) {
                    setPackages(data.packages);
                }
            } catch (err) {
                console.error('Error cargando paquetes:', err);
            } finally {
                setLoadingPackages(false);
            }
        };
        fetchPackages();

        return () => useCartStore.getState().clearCart();
    }, [slug]);

    if (slug !== 'free-fire') {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4 bg-background selection:bg-primary selection:text-black">
                <Gamepad2 className="w-24 h-24 text-muted mb-8" />
                <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter mb-4 text-center">
                    JUEGO EN <span className="text-primary">DESARROLLO</span>
                </h1>
                <p className="text-muted text-center max-w-md mb-10 font-bold uppercase tracking-widest text-sm">
                    Estamos trabajando para integrar {slug.replace('-', ' ')} a nuestro catálogo automático pronto.
                </p>
                <Button variant="secondary" onClick={() => router.push('/')} className="px-8 py-4">
                    <ArrowLeft className="w-5 h-5 mr-3" /> VOLVER AL INICIO
                </Button>
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
                    price: useCartStore.getState().price
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
        <div className="w-full pb-24 bg-background selection:bg-primary selection:text-black min-h-screen">
            <div className="bg-background border-b-2 border-border py-6">
                <div className="max-w-7xl mx-auto px-4 flex items-center">
                    <Link href="/#catalogo" className="group text-muted hover:text-primary transition-colors flex items-center text-sm font-black uppercase tracking-widest">
                        <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" />
                        VOLVER A JUEGOS
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16">
                <div className="mb-12 border-l-8 border-primary pl-6">
                    <h1 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-none mb-2">
                        RECARGA <br className="hidden md:block" />
                        <span className="text-primary">FREE FIRE</span>
                    </h1>
                    <p className="text-muted font-bold uppercase tracking-widest text-sm md:text-base mt-4">
                        DIAMANTES ENTREGADOS AUTOMÁTICAMENTE A TU CUENTA.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-5 space-y-6">
                        <Card className="border-2 border-border p-8 bg-card">
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <span className="bg-primary text-black w-10 h-10 flex items-center justify-center text-xl">1</span>
                                DATOS DE LA CUENTA
                            </h2>

                            <form onSubmit={validateId} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-muted mb-3 uppercase tracking-widest">
                                        PLAYER ID
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={localPlayerId}
                                            onChange={(e) => setLocalPlayerId(e.target.value)}
                                            placeholder=""
                                            className="w-full pl-5 pr-12 py-4 bg-background border-2 border-border outline-none transition-colors text-foreground font-black text-lg uppercase"
                                            disabled={loading}
                                        />
                                        <Search className="absolute right-4 top-4.5 text-muted w-6 h-6" />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-5 text-lg"
                                    disabled={!localPlayerId}
                                    isLoading={loading}
                                >
                                    {loading ? 'BUSCANDO...' : 'VERIFICAR CUENTA'}
                                </Button>
                            </form>

                            {error && (
                                <div className="mt-6 p-5 border-2 border-destructive flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                                    <p className="text-sm font-bold text-destructive uppercase tracking-widest mt-1">{error}</p>
                                </div>
                            )}

                            {nickname && (
                                <div className="mt-6 p-5 bg-success border-2 border-success flex items-center gap-5 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="text-black p-3">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-black font-black uppercase tracking-widest mb-1">VALIDACIÓN EXITOSA</p>
                                        <p className="text-2xl font-black text-black tracking-tighter">{nickname}</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="lg:col-span-7">
                        <Card className={`h-full border-2 border-border p-8 bg-card flex flex-col transition-all duration-300 ${!nickname ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <span className="bg-primary text-black w-10 h-10 flex items-center justify-center text-xl">2</span>
                                SELECCIONA TU PAQUETE
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={() => setActiveTab('diamonds')}
                                    className={`flex-1 py-4 border-2 font-black uppercase tracking-widest text-xs md:text-sm transition-colors flex items-center justify-center gap-2
                                        ${activeTab === 'diamonds' ? 'bg-primary border-primary text-black' : 'bg-background border-border text-muted hover:border-muted hover:text-foreground'}`}
                                >
                                    <Gem className="w-4 h-4" /> DIAMANTES
                                </button>
                                <button
                                    onClick={() => setActiveTab('memberships')}
                                    className={`flex-1 py-4 border-2 font-black uppercase tracking-widest text-xs md:text-sm transition-colors flex items-center justify-center gap-2
                                        ${activeTab === 'memberships' ? 'bg-primary border-primary text-black' : 'bg-background border-border text-muted hover:border-muted hover:text-foreground'}`}
                                >
                                    <Crown className="w-4 h-4" /> PASES Y MEMBRESÍAS
                                </button>
                            </div>

                            {loadingPackages ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
                                    <p className="text-sm font-black uppercase tracking-widest">OBTENIENDO CATÁLOGO...</p>
                                </div>
                            ) : displayedPackages.length === 0 ? (
                                <div className="flex items-center justify-center py-20 bg-background border-2 border-dashed border-border">
                                    <p className="text-center text-sm font-bold uppercase tracking-widest text-muted">
                                        NO HAY PAQUETES EN ESTA CATEGORÍA.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                                    {displayedPackages.map((pkg) => (
                                        <button
                                            key={pkg.code}
                                            onClick={() => setProduct(pkg.code, pkg.price)}
                                            className={`relative p-6 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-4 group cursor-pointer
                                                ${productCode === pkg.code
                                                ? 'border-primary bg-primary'
                                                : 'border-border bg-background hover:bg-primary hover:border-primary'}`}
                                        >
                                            {isMembership(pkg.code) && (
                                                <span className={`absolute top-0 right-0 text-[10px] font-black px-2 py-1 uppercase tracking-wider
                                                    ${productCode === pkg.code ? 'bg-black text-primary' : 'bg-foreground text-background group-hover:bg-black group-hover:text-primary'}`}>
                                                    PRO
                                                </span>
                                            )}

                                            <div className={`transition-colors duration-200 ${productCode === pkg.code ? 'text-black' : 'text-primary group-hover:text-black'}`}>
                                                {isMembership(pkg.code) ? <Crown className="w-10 h-10" /> : <Gem className="w-10 h-10" />}
                                            </div>

                                            <div className="text-center">
                                                <p className={`font-black text-sm md:text-base leading-tight mb-2 uppercase tracking-tight transition-colors duration-200
                                                    ${productCode === pkg.code ? 'text-black' : 'text-foreground group-hover:text-black'}`}>
                                                    {pkg.name}
                                                </p>
                                                <p className={`text-xl md:text-2xl font-black transition-colors duration-200 tracking-tighter
                                                    ${productCode === pkg.code ? 'text-black' : 'text-primary group-hover:text-black'}`}>
                                                    S/ {pkg.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="pt-8 border-t-2 border-border mt-auto">
                                <Button
                                    onClick={handleCheckout}
                                    variant="mercadoPago"
                                    className="w-full py-6 text-lg md:text-xl font-black tracking-widest"
                                    disabled={!productCode}
                                    isLoading={loading}
                                >
                                    {loading ? 'PROCESANDO...' : (
                                        <>
                                            PAGAR CON MERCADO PAGO
                                            {useCartStore.getState().price > 0 && ` (S/ ${useCartStore.getState().price.toFixed(2)})`}
                                        </>
                                    )}
                                </Button>
                                <div className="flex items-center justify-center gap-3 mt-6 text-muted text-xs font-black uppercase tracking-widest">
                                    <ShieldCheck className="w-5 h-5 text-success" />
                                    TRANSACCIÓN PROTEGIDA Y ENCRIPTADA
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
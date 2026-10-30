'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, DollarSign, ShieldAlert, ArrowLeft, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import OrdersTab from './OrdersTab';
import GamesTab from './GamesTab';
import PricingTab from './PricingTab';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'orders' | 'games' | 'pricing'>('orders');

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyFailed, setShowOnlyFailed] = useState(false);

    const [games, setGames] = useState<any[]>([]);
    const [rawCatalog, setRawCatalog] = useState<any[]>([]);
    const [productConfigs, setProductConfigs] = useState<Record<string, any>>({});
    const [loadingConfig, setLoadingConfig] = useState(false);

    const [selectedGameTab, setSelectedGameTab] = useState<string>('');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (activeTab === 'games' || activeTab === 'pricing') {
            fetchConfigData();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'pricing' && games.length > 0 && !selectedGameTab) {
            setSelectedGameTab(games[0].slug);
        }
    }, [games, activeTab, selectedGameTab]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) setOrders(data);
        setLoading(false);
    };

    const fetchConfigData = async () => {
        setLoadingConfig(true);
        const { data: gData } = await supabase.from('games_config').select('*');
        if (gData) setGames(gData);

        const { data: pData } = await supabase.from('product_config').select('*');
        const configMap: Record<string, any> = {};
        if (pData) pData.forEach(p => configMap[p.product_code] = p);
        setProductConfigs(configMap);

        const res = await fetch('/api/admin/catalog');
        const catData = await res.json();
        if (catData.success && catData.data?.catalog) {
            setRawCatalog(catData.data.catalog);
        }
        setLoadingConfig(false);
    };

    const handleGameChange = (index: number, field: string, value: any) => {
        const newGames = [...games];
        newGames[index][field] = value;
        setGames(newGames);
    };

    const handleCatalogSelect = (index: number, packageName: string) => {
        const newGames = [...games];
        const catalogItem = rawCatalog.find(c => c.packageName === packageName);

        newGames[index].codestore_match = packageName;

        if (catalogItem) {
            if (!newGames[index].name) {
                newGames[index].name = catalogItem.packageName.replace(/\s*\(.*?\)\s*/g, '').trim().toUpperCase();
            }
            if (!newGames[index].slug) {
                newGames[index].slug = catalogItem.slug || catalogItem.packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
        }
        setGames(newGames);
    };

    const addEmptyGame = () => {
        setGames([{ slug: '', name: '', publisher: '', image_url: '', codestore_match: '', is_active: true }, ...games]);
    };

    const saveGame = async (game: any) => {
        if (!game.slug || !game.codestore_match) return alert('El Slug y el Juego del Proveedor son obligatorios.');
        const { error } = await supabase.from('games_config').upsert({
            slug: game.slug,
            name: game.name,
            publisher: game.publisher,
            image_url: game.image_url,
            codestore_match: game.codestore_match,
            is_active: game.is_active
        });
        if (error) alert('Error: ' + error.message);
        else alert(`Juego ${game.name} guardado correctamente`);
    };

    const handlePriceChange = (code: string, field: string, value: any) => {
        setProductConfigs(prev => ({
            ...prev,
            [code]: { ...(prev[code] || { is_active: true, price_pen: 0 }), [field]: value }
        }));
    };

    const savePriceConfig = async (code: string, gameSlug: string) => {
        const conf = productConfigs[code];
        const { error } = await supabase.from('product_config').upsert({
            product_code: code,
            price_pen: Number(conf.price_pen) || 0,
            is_active: conf.is_active ?? true,
            game_slug: gameSlug
        }, {
            onConflict: 'product_code'
        });
        if (error) alert('Error al guardar: ' + error.message);
        else alert('Precio actualizado en la tienda');
    };

    const getCodeType = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('semanal') || n.includes('weekly')) return 'weekly';
        if (n.includes('mensual') || n.includes('monthly')) return 'monthly';
        if (n.includes('pase') || n.includes('level') || n.includes('pass')) return 'pass';
        return 'diamonds';
    };

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-primary selection:text-black font-sans pb-20">
            <div className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-xs font-bold text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Acceso Maestro</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border-b border-white/5 pt-12 pb-8 px-4 relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
                        CENTRO DE <span className="text-primary">MANDO</span>
                    </h1>

                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 text-xs font-black uppercase tracking-widest border transition-all ${activeTab === 'orders' ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-[#050505] text-zinc-500 border-white/10 hover:text-white'}`}>
                            <LayoutDashboard className="w-4 h-4 inline-block mr-2" /> Historial
                        </button>
                        <button onClick={() => setActiveTab('games')} className={`px-6 py-3 text-xs font-black uppercase tracking-widest border transition-all ${activeTab === 'games' ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-[#050505] text-zinc-500 border-white/10 hover:text-white'}`}>
                            <Gamepad2 className="w-4 h-4 inline-block mr-2" /> Juegos
                        </button>
                        <button onClick={() => setActiveTab('pricing')} className={`px-6 py-3 text-xs font-black uppercase tracking-widest border transition-all ${activeTab === 'pricing' ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-[#050505] text-zinc-500 border-white/10 hover:text-white'}`}>
                            <DollarSign className="w-4 h-4 inline-block mr-2" /> Precios
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 mt-8">
                {activeTab === 'orders' && (
                    <OrdersTab
                        orders={orders} loading={loading} searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm} showOnlyFailed={showOnlyFailed}
                        setShowOnlyFailed={setShowOnlyFailed} fetchOrders={fetchOrders}
                    />
                )}

                {activeTab === 'games' && (
                    <GamesTab
                        games={games} rawCatalog={rawCatalog} loadingConfig={loadingConfig}
                        addEmptyGame={addEmptyGame} handleCatalogSelect={handleCatalogSelect}
                        handleGameChange={handleGameChange} saveGame={saveGame}
                    />
                )}

                {activeTab === 'pricing' && (
                    <PricingTab
                        games={games} rawCatalog={rawCatalog} productConfigs={productConfigs}
                        loadingConfig={loadingConfig} selectedGameTab={selectedGameTab}
                        setSelectedGameTab={setSelectedGameTab} handlePriceChange={handlePriceChange}
                        savePriceConfig={savePriceConfig} getCodeType={getCodeType}
                    />
                )}
            </div>
        </div>
    );
}
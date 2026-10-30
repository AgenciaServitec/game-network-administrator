'use client';
import { Gamepad2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface PricingTabProps {
    games: any[];
    rawCatalog: any[];
    productConfigs: Record<string, any>;
    loadingConfig: boolean;
    selectedGameTab: string;
    setSelectedGameTab: (slug: string) => void;
    handlePriceChange: (code: string, field: string, value: any) => void;
    savePriceConfig: (code: string, gameSlug: string) => void;
    getCodeType: (name: string) => string;
}

export default function PricingTab({
                                       games, rawCatalog, productConfigs, loadingConfig, selectedGameTab, setSelectedGameTab, handlePriceChange, savePriceConfig, getCodeType
                                   }: PricingTabProps) {
    return (
        <div className="animate-in fade-in flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 px-2">Seleccionar Juego</h2>
                {games.map(game => (
                    <button
                        key={game.slug}
                        onClick={() => setSelectedGameTab(game.slug)}
                        className={`flex items-center gap-3 p-3 border transition-all text-left ${selectedGameTab === game.slug ? 'bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'bg-[#0a0a0a] border-white/10 text-zinc-500 hover:text-white hover:border-white/30'}`}
                    >
                        {game.image_url ? (
                            <img src={game.image_url} className="w-8 h-8 object-contain" alt="Icon" />
                        ) : (
                            <Gamepad2 className="w-6 h-6" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{game.name || 'Sin Nombre'}</span>
                    </button>
                ))}
                {games.length === 0 && (
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest p-4 text-center border border-dashed border-white/10">No hay juegos agregados.</p>
                )}
            </div>

            <div className="flex-1 bg-[#0a0a0a] border border-white/10 relative">
                {loadingConfig ? (
                    <p className="text-zinc-500 text-center py-20">Conectando con Codestore...</p>
                ) : (
                    <>
                        {games.map(game => {
                            if (game.slug !== selectedGameTab) return null;

                            const catalogData = rawCatalog.find(c => c.packageName === game.codestore_match);

                            if (!catalogData) return (
                                <div key={game.slug} className="p-10 text-center">
                                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                                    <p className="text-zinc-400 text-sm">No se encontró el catálogo en Codestore para este juego.</p>
                                    <p className="text-xs text-zinc-600 mt-2">Revisa que el nombre coincida exactamente en la pestaña de Juegos.</p>
                                </div>
                            );

                            return (
                                <div key={game.slug} className="animate-in fade-in">
                                    <div className="bg-primary/10 border-b border-primary/20 p-6">
                                        <h3 className="text-xl font-black text-white uppercase tracking-widest">{game.name}</h3>
                                        <p className="text-xs text-zinc-400 mt-1">Aquí verás el costo base que cobra Codestore (en USD). Fija tu precio de venta al público en Soles (PEN).</p>
                                    </div>

                                    <div className="overflow-x-auto p-4 custom-scrollbar">
                                        <table className="w-full text-left">
                                            <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="pb-3 px-4 text-[10px] font-black uppercase text-zinc-500">Paquete</th>
                                                <th className="pb-3 text-[10px] font-black uppercase text-zinc-500 text-center">Costo Codestore</th>
                                                <th className="pb-3 text-[10px] font-black uppercase text-primary">Precio Venta (PEN)</th>
                                                <th className="pb-3 text-[10px] font-black uppercase text-zinc-500 text-right">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                            {catalogData.products.map((product: any) => {
                                                const code = `${getCodeType(product.name)}___${product.productId}___${product.sku}`;
                                                const config = productConfigs[code] || { price_pen: 0, is_active: true };

                                                return (
                                                    <tr key={code} className={`hover:bg-white/[0.02] transition-colors ${config.is_active ? '' : 'opacity-40 grayscale'}`}>
                                                        <td className="py-4 px-4 min-w-[200px]">
                                                            <p className="text-xs font-bold text-white tracking-widest">{product.name}</p>
                                                        </td>
                                                        <td className="py-4 text-center">
                                                            <span className="bg-zinc-800 text-zinc-300 px-3 py-1.5 text-[10px] font-mono shadow-inner">${product.price.toFixed(2)} USD</span>
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="relative w-32">
                                                                <span className="absolute left-3 top-2.5 text-xs font-bold text-zinc-500">S/</span>
                                                                <input
                                                                    type="number"
                                                                    value={config.price_pen}
                                                                    onChange={(e) => handlePriceChange(code, 'price_pen', e.target.value)}
                                                                    className="w-full bg-[#050505] border border-white/10 pl-8 pr-3 py-2 text-sm font-black text-primary outline-none focus:border-primary transition-all"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-right flex items-center justify-end gap-2 pr-4">
                                                            <button onClick={() => handlePriceChange(code, 'is_active', !config.is_active)} className="text-zinc-500 hover:text-white p-2" title={config.is_active ? "Ocultar de la tienda" : "Mostrar en la tienda"}>
                                                                {config.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                            </button>
                                                            <button onClick={() => savePriceConfig(code, game.slug)} className="bg-white/5 hover:bg-primary hover:text-black border border-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all">
                                                                Guardar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}
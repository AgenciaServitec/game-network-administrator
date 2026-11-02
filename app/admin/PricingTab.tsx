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
        <div className="animate-in fade-in flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex flex-col gap-3 shrink-0">
                <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-1 px-1 border-b-2 border-white/10 pb-3">Seleccionar Juego</h2>
                {games.map(game => (
                    <button
                        key={game.slug}
                        onClick={() => setSelectedGameTab(game.slug)}
                        className={`flex items-center gap-3 p-3 border-2 transition-all duration-200 text-left cursor-pointer ${
                            selectedGameTab === game.slug
                                ? 'bg-primary/10 border-primary text-white shadow-[5px_5px_0px_#ff2a1f] -translate-x-1 -translate-y-1'
                                : 'bg-[#110f16] border-white/20 text-zinc-400 shadow-[4px_4px_0px_#1f1a29] hover:text-white hover:border-primary hover:-translate-x-1 hover:-translate-y-1'
                        }`}
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
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] p-4 text-center border-2 border-dashed border-white/10 bg-[#110f16]">No hay juegos agregados.</p>
                )}
            </div>

            <div className="flex-1 bg-[#110f16] border-2 border-white/20 shadow-[6px_6px_0px_#1f1a29] relative min-w-0">
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff] z-10" />
                {loadingConfig ? (
                    <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse text-center py-20">Conectando con Codestore...</p>
                ) : (
                    <>
                        {games.map(game => {
                            if (game.slug !== selectedGameTab) return null;

                            const catalogData = rawCatalog.find(c => c.packageName === game.codestore_match);

                            if (!catalogData) return (
                                <div key={game.slug} className="p-10 text-center">
                                    <div className="inline-block bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-4 mb-4 -skew-x-6">
                                        <AlertTriangle className="w-10 h-10 text-[#ff2a1f] skew-x-6" />
                                    </div>
                                    <p className="text-zinc-300 text-sm font-bold">No se encontró el catálogo en Codestore para este juego.</p>
                                    <p className="text-xs text-zinc-500 mt-2">Revisa que el nombre coincida exactamente en la pestaña de Juegos.</p>
                                </div>
                            );

                            return (
                                <div key={game.slug} className="animate-in fade-in">
                                    <div className="bg-[#0a080d] bg-halftone-crimson border-b-2 border-[#ff2a1f] p-6">
                                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{game.name}</h3>
                                        <div className="pl-4 border-l-4 border-primary mt-3 bg-black/40 py-2 pr-4 max-w-2xl">
                                            <p className="text-xs text-zinc-300 font-medium leading-relaxed">Aquí verás el costo base que cobra Codestore (en USD). Fija tu precio de venta al público en Soles (PEN).</p>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto p-4 custom-scrollbar">
                                        <table className="w-full text-left">
                                            <thead>
                                            <tr className="border-b-2 border-white/15">
                                                <th className="pb-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Paquete</th>
                                                <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Costo Codestore</th>
                                                <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Precio Venta (PEN)</th>
                                                <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right pr-4">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                            {catalogData.products.map((product: any) => {
                                                const code = `${getCodeType(product.name)}___${product.productId}___${product.sku}`;
                                                const config = productConfigs[code] || { price_pen: 0, is_active: true };

                                                return (
                                                    <tr key={code} className={`hover:bg-white/[0.03] transition-colors ${config.is_active ? '' : 'opacity-40 grayscale'}`}>
                                                        <td className="py-4 px-4 min-w-[200px]">
                                                            <p className="text-xs font-black text-white uppercase tracking-widest">{product.name}</p>
                                                        </td>
                                                        <td className="py-4 text-center">
                                                            <span className="bg-black/50 border border-white/10 text-zinc-300 px-3 py-1.5 text-[10px] font-mono">${product.price.toFixed(2)} USD</span>
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="relative w-32">
                                                                <span className="absolute left-3 top-2.5 text-xs font-black text-zinc-500">S/</span>
                                                                <input
                                                                    type="number"
                                                                    value={config.price_pen}
                                                                    onChange={(e) => handlePriceChange(code, 'price_pen', e.target.value)}
                                                                    className="w-full bg-[#070609] border-2 border-white/15 pl-8 pr-3 py-2 text-sm font-black font-mono text-primary outline-none focus:border-primary focus:shadow-[3px_3px_0px_#ff2a1f] transition-all"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 pr-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => handlePriceChange(code, 'is_active', !config.is_active)}
                                                                    className={`p-2 border-2 transition-colors cursor-pointer ${config.is_active ? 'text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10' : 'text-zinc-500 border-white/10 hover:text-white'}`}
                                                                    title={config.is_active ? "Ocultar de la tienda" : "Mostrar en la tienda"}
                                                                >
                                                                    {config.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => savePriceConfig(code, game.slug)}
                                                                    className="bg-primary hover:bg-[#ffc42e] text-black border-2 border-black shadow-[3px_3px_0px_#ff2a1f] hover:shadow-[1px_1px_0px_#ff2a1f] hover:translate-x-0.5 hover:translate-y-0.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </div>
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
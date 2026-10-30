'use client';
import { Plus, ImageIcon, Link as LinkIcon, Eye, EyeOff, Save } from 'lucide-react';

interface GamesTabProps {
    games: any[];
    rawCatalog: any[];
    loadingConfig: boolean;
    addEmptyGame: () => void;
    handleCatalogSelect: (index: number, packageName: string) => void;
    handleGameChange: (index: number, field: string, value: any) => void;
    saveGame: (game: any) => void;
}

export default function GamesTab({
                                     games, rawCatalog, loadingConfig, addEmptyGame, handleCatalogSelect, handleGameChange, saveGame
                                 }: GamesTabProps) {
    return (
        <div className="animate-in fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-primary/10 border border-primary/20 p-6">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Catálogo de Juegos</h2>
                    <p className="text-xs text-zinc-400 mt-1">Vincula juegos desde el proveedor y configura cómo se verán en tu tienda.</p>
                </div>
                <button onClick={addEmptyGame} className="bg-primary text-black px-6 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform w-fit">
                    <Plus className="w-4 h-4" /> Añadir Juego
                </button>
            </div>

            {loadingConfig ? <p className="text-zinc-500 text-center py-10">Cargando...</p> : games.map((game, index) => (
                <div key={index} className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col md:flex-row gap-6 relative">
                    <div className="w-full md:w-48 h-48 bg-[#050505] border border-white/10 flex items-center justify-center overflow-hidden relative shrink-0">
                        {game.image_url ? (
                            <img src={game.image_url} alt="Portada" className="w-full h-full object-contain" />
                        ) : (
                            <ImageIcon className="w-10 h-10 text-zinc-700" />
                        )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 bg-primary/5 p-4 border border-primary/20 rounded-md">
                            <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                <LinkIcon className="w-3 h-3" /> 1. Vincular con catálogo de proveedor
                            </label>
                            <select
                                value={game.codestore_match || ''}
                                onChange={e => handleCatalogSelect(index, e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 px-3 py-3 text-sm text-white outline-none focus:border-primary cursor-pointer"
                            >
                                <option value="">-- Selecciona un juego de Codestore --</option>
                                {rawCatalog.map(c => (
                                    <option key={c.packageName} value={c.packageName}>
                                        {c.packageName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">2. Slug (URL de tu tienda)</label>
                            <input type="text" value={game.slug || ''} onChange={e => handleGameChange(index, 'slug', e.target.value)} placeholder="ej: free-fire" className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">3. Nombre al Público</label>
                            <input type="text" value={game.name || ''} onChange={e => handleGameChange(index, 'name', e.target.value)} placeholder="FREE FIRE" className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">4. Distribuidor (Opcional)</label>
                            <input type="text" value={game.publisher || ''} onChange={e => handleGameChange(index, 'publisher', e.target.value)} placeholder="GARENA" className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">5. Logo / Portada (URL)</label>
                            <input type="text" value={game.image_url || ''} onChange={e => handleGameChange(index, 'image_url', e.target.value)} placeholder="/freefirelogo.webp" className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary" />
                        </div>

                        <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-white/5 gap-4">
                            <button onClick={() => handleGameChange(index, 'is_active', !game.is_active)} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${game.is_active ? 'text-green-400' : 'text-zinc-600'}`}>
                                {game.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                {game.is_active ? 'Visible en Tienda' : 'Oculto al público'}
                            </button>
                            <button onClick={() => saveGame(game)} className="w-full sm:w-auto bg-white text-black px-6 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-colors">
                                <Save className="w-4 h-4" /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
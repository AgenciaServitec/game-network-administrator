'use client';
import { DollarSign, CheckCircle, AlertTriangle, RefreshCcw, Filter } from 'lucide-react';

interface OrdersTabProps {
    orders: any[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    showOnlyFailed: boolean;
    setShowOnlyFailed: (val: boolean) => void;
    fetchOrders: () => void;
}

export default function OrdersTab({
                                      orders, loading, searchTerm, setSearchTerm, showOnlyFailed, setShowOnlyFailed, fetchOrders
                                  }: OrdersTabProps) {
    const totalIncome = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0);
    const failedOrders = orders.filter(o => o.status === 'failed_injection');
    const successfulOrders = orders.filter(o => o.status === 'completed');

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.player_id?.includes(searchTerm) || o.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) || o.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
        const matchesStatus = showOnlyFailed ? o.status === 'failed_injection' : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#0a0a0a] border border-white/10 p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/5 border border-white/10 p-3"><DollarSign className="w-6 h-6 text-primary" /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ingresos Netos</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">S/ {totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/10 p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/5 border border-white/10 p-3"><CheckCircle className="w-6 h-6 text-green-400" /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Recargas Exitosas</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">{successfulOrders.length}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-red-500/30 p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-red-500/10 border border-red-500/20 p-3"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Alertas Inyección</span>
                    </div>
                    <p className="text-4xl font-black text-red-400 tracking-tighter">{failedOrders.length}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <button onClick={fetchOrders} className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-primary transition-colors">
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar tabla
                </button>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowOnlyFailed(!showOnlyFailed)} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border ${showOnlyFailed ? 'bg-red-500 text-black border-red-500' : 'text-zinc-500 border-white/10'}`}>
                        <Filter className="w-4 h-4 inline-block mr-2" /> Fallidos
                    </button>
                    <input type="text" placeholder="Buscar ID, correo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 px-4 py-3 bg-[#0a0a0a] border border-white/10 text-xs text-white outline-none focus:border-primary" />
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 overflow-x-auto shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                    <tr className="bg-[#050505] border-b border-white/10">
                        <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Estado</th>
                        <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Fecha/ID</th>
                        <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Cliente</th>
                        <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Cuenta</th>
                        <th className="p-4 text-[10px] font-black uppercase text-zinc-500 text-right">Monto</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/[0.02]">
                            <td className="p-4 align-top">
                                {order.status === 'completed' && <span className="text-green-400 bg-green-400/10 px-2 py-1 text-[10px] font-black uppercase"><CheckCircle className="w-3 h-3 inline mr-1" /> Completado</span>}
                                {order.status === 'failed_injection' && <span className="text-black bg-red-500 px-2 py-1 text-[10px] font-black uppercase animate-pulse"><AlertTriangle className="w-3 h-3 inline mr-1" /> Falló API</span>}
                                {order.status !== 'completed' && order.status !== 'failed_injection' && <span className="text-yellow-400 bg-yellow-400/10 px-2 py-1 text-[10px] font-black uppercase">Pendiente</span>}
                            </td>
                            <td className="p-4 align-top">
                                <p className="text-xs font-bold text-white mb-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-[10px] text-zinc-600 font-mono">ID: {order.id.split('-')[0]}</p>
                            </td>
                            <td className="p-4 align-top">
                                <p className="text-xs font-bold text-white">{order.user_email || 'No registrado'}</p>
                            </td>
                            <td className="p-4 align-top">
                                <p className="text-sm font-black text-white">{order.nickname}</p>
                                <p className="text-[10px] text-zinc-500">ID: {order.player_id}</p>
                            </td>
                            <td className="p-4 align-top text-right">
                                <p className="text-lg font-black text-primary">S/ {order.price?.toFixed(2)}</p>
                                <span className="text-[9px] text-zinc-500 uppercase">{order.product_code.split('___')[0]}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
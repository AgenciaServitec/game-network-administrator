'use client';

import { useState } from 'react';
import { Search, CheckCircle2, XCircle, Loader2, Diamond } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const PACKAGES = [
  { code: 'FF5', name: '5 Diamantes', price: 1.50 },
  { code: 'FF10', name: '10 Diamantes', price: 2.80 },
  { code: 'FF20', name: '20 Diamantes', price: 5.50 },
  { code: 'FF50', name: '50 Diamantes', price: 13.00 },
];

export default function Home() {
  const [localPlayerId, setLocalPlayerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { nickname, productCode, setPlayer, setProduct } = useCartStore();

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

  return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Recarga Free Fire
          </h1>

          <form onSubmit={validateId} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player ID
              </label>
              <div className="relative">
                <input
                    type="text"
                    value={localPlayerId}
                    onChange={(e) => setLocalPlayerId(e.target.value)}
                    placeholder="Ej. 2219422568"
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    disabled={loading}
                />
                <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
                type="submit"
                disabled={loading || !localPlayerId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Validar ID'}
            </button>
          </form>

          {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 mt-0.5">{error}</p>
              </div>
          )}

          {nickname && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-xs text-green-800 font-medium uppercase tracking-wider">Cuenta verificada</p>
                    <p className="text-lg font-bold text-green-900">{nickname}</p>
                  </div>
                </div>

                <h2 className="text-sm font-semibold text-gray-700 mb-3">Selecciona tu recarga:</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {PACKAGES.map((pkg) => (
                      <button
                          key={pkg.code}
                          onClick={() => setProduct(pkg.code, pkg.price)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                    ${productCode === pkg.code
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        <Diamond className={`w-8 h-8 ${productCode === pkg.code ? 'text-blue-600' : 'text-cyan-400'}`} />
                        <span className="font-bold text-gray-800">{pkg.name}</span>
                        <span className="text-sm font-medium text-gray-500">S/ {pkg.price.toFixed(2)}</span>
                      </button>
                  ))}
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={!productCode}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                >
                  Proceder a Pagar {useCartStore.getState().price > 0 ? `(S/ ${useCartStore.getState().price.toFixed(2)})` : ''}
                </button>
              </div>
          )}
        </div>
      </main>
  );
}
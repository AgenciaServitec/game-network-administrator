'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Shield, ShoppingCart, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const heroImages = [
  '/hero-ff.png',
  '/hero-2.png',
  '/hero-3.png'
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [games, setGames] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroImages.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
          .from('games_config')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });

      if (data) setGames(data);
      setLoadingGames(false);
    };
    fetchGames();
  }, []);

  return (
      <div className="w-full bg-[#050505] selection:bg-primary selection:text-black font-sans">
        <div className="w-full bg-[#0a0a0a] border-b border-white/5 text-muted py-2.5 hidden md:block z-50 relative">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-2 hover:text-primary transition-colors"><Zap className="w-3.5 h-3.5 text-primary" /> Entrega Instántanea</span>
              <span className="flex items-center gap-2 hover:text-primary transition-colors"><Shield className="w-3.5 h-3.5 text-primary" /> Protección Anti-Ban</span>
            </div>
          </div>
        </div>

        <section className="relative w-full border-b border-white/10 overflow-hidden min-h-[90vh] lg:min-h-[85vh] flex items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#050505] to-[#050505]">
          <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
            <div className="absolute right-0 top-0 w-[55%] h-full bg-primary/20 blur-3xl -translate-x-10 opacity-50" />
            <div className="absolute right-0 top-0 w-[55%] h-full bg-primary shadow-[-20px_0_50px_rgba(250,204,21,0.15)]" style={{ clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 10% 100%, 25% 60%, 5% 60%, 25% 25%, 10% 25%)' }} />
          </div>
          <div className="absolute inset-0 z-0 pointer-events-none lg:hidden">
            <div className="absolute bottom-0 w-full h-[65%] bg-primary shadow-[0_-20px_50px_rgba(250,204,21,0.2)]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 15%, 70% 20%, 80% 5%, 30% 10%, 40% 0, 0 10%)' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 w-full relative z-20 h-full flex flex-col justify-center pt-10 pb-40 lg:py-0">
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <h1 className="text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] font-black text-white uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                TODO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-yellow-600 drop-shadow-[0_0_30px_rgba(250,204,21,0.3)] lg:text-foreground lg:bg-none lg:drop-shadow-none">
                                DIGITAL
                            </span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-md mb-10 leading-relaxed">
                Recargas oficiales sin esperas. Ingresa tu ID, completa el pago de forma segura y <strong className="text-white font-bold">domina tu juego al instante.</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                <a href="#catalogo" className="group relative flex items-center justify-center gap-3 bg-primary text-black font-black text-lg px-8 py-4 uppercase tracking-widest overflow-hidden rounded-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(250,204,21,0.4)]">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-3"><Sparkles className="w-5 h-5" /> Explorar Tienda</span>
                </a>
              </div>
              <div className="mt-12 flex flex-wrap gap-4 w-full max-w-lg">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex-1 flex items-center gap-4 shadow-2xl">
                  <div className="bg-primary/10 p-2 rounded-lg"><TrendingUp className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="text-2xl font-black text-white leading-none">10K+</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Recargas</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex-1 flex items-center gap-4 shadow-2xl">
                  <div className="bg-primary/10 p-2 rounded-lg"><Shield className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="text-2xl font-black text-white leading-none">100%</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Garantía</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-full lg:w-[55%] h-[60%] lg:h-[90%] z-10 pointer-events-none flex justify-center lg:justify-end">
            {heroImages.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt={`Personaje ${index + 1}`}
                    className={`absolute bottom-0 w-[95%] lg:w-[110%] h-[100%] object-contain object-bottom origin-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-1000 ease-out ${currentSlide === index ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
                />
            ))}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-black/60 blur-xl" />
          </div>
        </section>

        <section id="catalogo" className="max-w-7xl mx-auto px-4 py-24 relative z-10">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Colección Premium</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Productos <br className="md:hidden" /> Destacados
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loadingGames ? (
                <div className="col-span-full py-10 flex flex-col items-center justify-center">
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest animate-pulse">Sincronizando catálogo...</p>
                </div>
            ) : games.map((game) => (
                <Link key={game.slug} href={`/game/${game.slug}`} className="block h-full group">
                  <div className="relative h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(250,204,21,0.1)] hover:border-primary/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                                    <span className="bg-black/80 backdrop-blur text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-primary/20 shadow-lg">
                                        💎 OFICIAL
                                    </span>
                    </div>

                    <div className="w-full h-56 flex items-center justify-center p-8 relative z-10 bg-zinc-900/50">
                      <img
                          src={game.image_url}
                          alt={game.name}
                          className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="p-6 relative z-10 flex-1 flex flex-col bg-[#0a0a0a]">
                      <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">{game.publisher}</p>
                      <h3 className="text-2xl font-black text-white tracking-tighter mb-4 group-hover:text-primary transition-colors">
                        {game.name}
                      </h3>

                      <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-zinc-500 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary"/> Entrega</span>
                          <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-right">AUTOMÁTICA</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-zinc-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary"/> Tiempo</span>
                          <span className="text-white text-right">INSTANTÁNEO</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
            ))}

            <div className="h-full min-h-[350px] relative group cursor-not-allowed">
              <div className="relative h-full flex flex-col bg-[#050505] rounded-2xl border-2 border-dashed border-white/10 p-6 justify-center items-center opacity-60">
                <div className="bg-white/5 p-4 rounded-full mb-4"><ShoppingCart className="w-8 h-8 text-zinc-500" /></div>
                <h3 className="text-lg font-black text-white tracking-tighter mb-1 text-center">NUEVOS TÍTULOS</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary text-center">Próximamente</p>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
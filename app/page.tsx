'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Gamepad2, Terminal } from 'lucide-react';

const games = [
  {
    id: 'free-fire',
    name: 'FREE FIRE',
    publisher: 'GARENA',
    image: '/freefirelogo.webp'
  }
];

const heroImages = [
  '/hero-ff.png',
  '/hero-2.png',
  '/hero-3.png'
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
      <div className="w-full bg-background selection:bg-primary selection:text-black">

        <section className="relative w-full border-b-4 border-border overflow-hidden flex flex-col justify-end min-h-[90vh] lg:min-h-0">

          <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
            <div
                className="absolute right-0 top-0 w-[56%] h-full bg-border/40 -translate-x-2"
                style={{ clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%, 25% 55%, 10% 55%)' }}
            />
            <div
                className="absolute right-0 top-0 w-[55%] h-full bg-primary"
                style={{ clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%, 25% 55%, 10% 55%)' }}
            />
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none lg:hidden">
            <div
                className="absolute bottom-0 w-full h-[65%] bg-primary"
                style={{ clipPath: 'polygon(0 30%, 35% 10%, 25% 40%, 100% 15%, 100% 100%, 0 100%)' }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-end relative z-10 pt-20 lg:pt-32">

            <div className="flex flex-col items-start text-left pb-10 lg:pb-32 relative z-20">
              <h1 className="text-6xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-lg transition-all">
                DIAMANTES <br />
                <span className="text-primary lg:text-foreground">AL INSTANTE</span>
              </h1>

              <p className="text-muted text-lg md:text-2xl font-medium max-w-lg mb-10 leading-snug">
                RECARGAS OFICIALES. CERO ESPERAS. INGRESA TU ID Y DOMINA EL JUEGO.
              </p>

              <a
                  href="#catalogo"
                  className="group flex items-center justify-center gap-4 bg-primary text-black font-black text-lg md:text-xl px-10 py-5 uppercase tracking-widest hover:bg-white transition-colors duration-200 shadow-[8px_8px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              >
                Recargar Ahora
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>

            <div className="relative w-full h-112.5 lg:h-[650px] flex flex-col items-center lg:items-end justify-end">
              <div className="absolute inset-0 w-full h-full">
                {heroImages.map((src, index) => (
                    <img
                        key={src}
                        src={src}
                        alt={`Hero Image ${index + 1}`}
                        className={`absolute bottom-0 left-0 w-full h-full object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-opacity duration-700 ease-in-out ${
                            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="catalogo" className="max-w-7xl mx-auto px-4 py-32 relative z-10">

          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b-4 border-border pb-8 gap-6">
            <div>
              <h2 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-none">
                SELECCIONA <br />
                <span className="text-primary">TU JUEGO</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">

            {games.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="block h-full group relative">

                  <div className="absolute inset-0 bg-primary translate-x-3 translate-y-3 transition-transform duration-200 group-hover:translate-x-0 group-hover:translate-y-0" />

                  <div className="relative h-full flex flex-col bg-card border-4 border-border p-8 transition-colors duration-200 group-hover:bg-primary group-hover:border-primary z-10">
                    <div className="w-full flex items-center justify-center py-6 mb-auto">
                      <img
                          src={game.image}
                          alt={game.name}
                          className="w-52 md:w-60 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:brightness-0 transition-all duration-300 relative z-10"
                      />
                    </div>

                    <div className="mt-12 border-t-4 border-border pt-6 group-hover:border-black transition-colors">
                      <p className="text-muted group-hover:text-black/70 text-sm font-black uppercase tracking-widest mb-1 transition-colors duration-200">
                        {game.publisher}
                      </p>
                      <div className="flex items-center justify-between overflow-hidden">
                        <h3 className="text-3xl lg:text-4xl font-black text-foreground group-hover:text-black transition-colors duration-200 tracking-tighter">
                          {game.name}
                        </h3>
                        <ArrowRight className="w-8 h-8 text-black opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>

                  </div>
                </Link>
            ))}

            <div className="h-full min-h-[350px] relative group cursor-not-allowed">

              <div className="absolute inset-0 bg-border/20 translate-x-3 translate-y-3" />

              <div className="relative h-full flex flex-col bg-background border-4 border-dashed border-border p-8 justify-between z-10 opacity-60 grayscale">

                <div className="absolute top-0 right-0 px-3 py-1 bg-border text-background text-[10px] font-black uppercase tracking-widest">
                  LOCKED
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <Gamepad2 className="w-20 h-20 text-border" />
                </div>

                <div className="border-t-4 border-dashed border-border pt-6">
                  <p className="text-muted text-sm font-black uppercase tracking-widest mb-1">
                    EN DESARROLLO
                  </p>
                  <h3 className="text-3xl lg:text-4xl font-black text-muted tracking-tighter">
                    MÁS JUEGOS
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
  );
}
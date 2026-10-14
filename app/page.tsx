import Link from 'next/link';
import { ArrowRight, Gamepad2 } from 'lucide-react';

const games = [
  {
    id: 'free-fire',
    name: 'FREE FIRE',
    publisher: 'GARENA',
    image: '/freefirelogo.webp'
  }
];

export default function Home() {
  return (
      <div className="w-full bg-background selection:bg-primary selection:text-black">

        <section className="relative w-full border-b-2 border-border overflow-hidden flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-end relative z-10 pt-20 lg:pt-32">

            <div className="flex flex-col items-start text-left pb-20 lg:pb-32">
              <h1 className="text-6xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-[0.85] mb-6">
                DIAMANTES <br />
                <span className="text-primary">AL INSTANTE</span>
              </h1>

              <p className="text-muted text-lg md:text-2xl font-medium max-w-lg mb-10 leading-snug">
                RECARGAS OFICIALES. CERO ESPERAS. INGRESA TU ID Y DOMINA EL JUEGO.
              </p>

              <a
                  href="#catalogo"
                  className="group flex items-center justify-center gap-4 bg-primary text-black font-black text-lg md:text-xl px-10 py-5 uppercase tracking-widest hover:bg-white transition-colors duration-200"
              >
                Recargar Ahora
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>

            <div className="relative w-full h-100 lg:h-162.5 flex items-end justify-center lg:justify-end">
              <img
                  src="/hero-ff.png"
                  alt="Free Fire Hero"
                  className="object-contain object-bottom w-full h-full drop-shadow-[0_0_40px_rgba(250,204,21,0.15)] block"
              />
            </div>
          </div>
        </section>

        <section id="catalogo" className="max-w-7xl mx-auto px-4 py-32">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">
              SELECCIONA <br />
              <span className="text-muted">TU JUEGO</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {games.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="block h-full">
                  <div className="group h-full flex flex-col bg-card border-2 border-border p-8 transition-all duration-200 hover:bg-primary hover:border-primary cursor-pointer">

                    <div className="w-full flex items-center justify-start mb-auto">
                      <img
                          src={game.image}
                          alt={game.name}
                          className="w-52 md:w-60 object-contain drop-shadow-xl group-hover:scale-110 group-hover:brightness-0 transition-all duration-300"
                      />
                    </div>

                    <div className="mt-12">
                      <p className="text-muted group-hover:text-black/70 text-sm font-bold uppercase tracking-widest mb-2 transition-colors duration-200">
                        {game.publisher}
                      </p>
                      <h3 className="text-3xl font-black text-foreground group-hover:text-black transition-colors duration-200 tracking-tighter">
                        {game.name}
                      </h3>
                    </div>

                  </div>
                </Link>
            ))}

            <div className="h-full min-h-75 flex flex-col bg-transparent border-2 border-dashed border-border p-8 justify-between opacity-50 grayscale">
              <Gamepad2 className="w-16 h-16 text-muted mb-8" />
              <div className="mt-8">
                <p className="text-muted text-sm font-bold uppercase tracking-widest mb-2">
                  PRÓXIMAMENTE
                </p>
                <h3 className="text-3xl font-black text-muted tracking-tighter">
                  MÁS JUEGOS
                </h3>
              </div>
            </div>

          </div>
        </section>
      </div>
  );
}
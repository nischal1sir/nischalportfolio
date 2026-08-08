import profile from "../assets/profile.jpg"
import gg from "../assets/gg.jpg"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#111] font-sans selection:bg-black selection:text-white flex flex-col relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&display=swap');
        .font-bodoni-main {
          font-family: 'Bodoni Moda', 'Bodoni MT', 'Didot', 'Times New Roman', serif;
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={gg}
          alt=""
          className="w-full h-full object-cover blur-[4px] opacity-40"
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-5 py-4 text-[10px] tracking-[0.12em] uppercase text-[#111]">
        <span className="font-medium">Nischal Rai'</span>
        <span className="font-medium">folio</span>
        <span className="font-medium">@hello</span>
      </nav>

      {/* Hero — justify-between on mobile, normal flow on desktop */}
      <section className="relative z-10 flex-1 flex flex-col items-center px-4 sm:flex-none sm:min-h-0 justify-between sm:justify-start py-6 sm:py-0">
        
        {/* Title — stays at top */}
        <div className="flex flex-col items-center pt-4 sm:pt-2">
          <h1 className="font-bodoni-main text-center leading-[0.82] sm:leading-[0.85] tracking-[-0.02em] text-[#0a0a0a]">
            <span className="block text-[clamp(3.2rem,16vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              Nischal
            </span>
            <span className="block text-[clamp(3.2rem,16vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              FuckingSucks
            </span>
          </h1>
          <p className="mt-4 sm:mt-5 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-medium text-[#333] text-center">
            FullStack developer
          </p>
        </div>

        {/* Photo — stays at bottom on mobile with padding, normal on desktop */}
        <div className="relative sm:mt-10 pb-4 sm:pb-0">
          <div className="w-[200px] h-[260px] sm:w-[200px] sm:h-[260px] lg:w-[220px] lg:h-[280px] rotate-[-6deg] shadow-xl overflow-hidden bg-[#ddd]">
            <img src={profile} alt="Photo" className="w-full h-full object-cover grayscale" />
          </div>
        </div>
      </section>

      <section className="hidden sm:block relative z-10 px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-3xl mx-auto lg:mx-0 lg:max-w-2xl">
        <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 sm:mb-5 text-[#111]">
          About
        </h2>
        <div className="border border-[#4a90d9] p-4 sm:p-5 max-w-lg">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#222] font-normal">
            I build quiet, precise interfaces — the kind that get out of the way.
            Currently shaping front-end work......Development on going
          </p>
        </div>
      </section>
    </div>
  );
}
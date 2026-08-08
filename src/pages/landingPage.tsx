import { useState, useEffect } from 'react';
import CardArc7 from '../components/CardArc7';

import photo from '../assets/profile.jpg';
import photo1 from '../assets/image1.png';
import photo2 from '../assets/image2.png';
import photo3 from '../assets/image3.png';
import photo4 from '../assets/image4.png';
import photo5 from '../assets/image5.png';
import photo6 from '../assets/image6.png';

const photos = [photo,photo1, photo2, photo3, photo4,photo5,photo6];


export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="bg-[#f4f4f4] text-[#111] font-sans selection:bg-black selection:text-white flex flex-col relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&display=swap');
        .font-bodoni-main {
          font-family: 'Bodoni Moda', 'Bodoni MT', 'Didot', 'Times New Roman', serif;
        }
      `}</style>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-5 py-4 text-[10px] tracking-[0.12em] uppercase text-[#111]">
        <span className="font-medium">Nischal Rai'</span>
        <span className="font-medium hidden sm:inline">folio</span>
        <span className="font-medium">@hello</span>
      </nav>

      {/* Hero sec */}
      <section className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Title */}
        <div 
          className={`flex flex-col items-center pt-6 sm:pt-8 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="font-bodoni-main text-center leading-[0.82] sm:leading-[0.85] tracking-[-0.02em] text-[#0a0a0a]">
            <span className="block text-[clamp(3.2rem,14vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              Nischal
            </span>
            <span className="block text-[clamp(3.2rem,14vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              FuckingSucks
            </span>
          </h1>
          
          <p className="mt-4 bg-red-300 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold text-black text-center">
            FullStack developer
          </p>
        </div>

        {/* Card 7*/}
        <div 
          className={`relative mt-8 sm:mt-10 mb-10 sm:mb-12 transition-all duration-700 delay-200 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
            <CardArc7
              images={photos}
              angle={45}
              gap={110}
              yOffset={30}
              hoverIntensity={1}
              cardClassName="bg-neutral-800"
            />
        </div>
      </section>

      {/* About — follows immediately */}
      <section 
        className={`relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 max-w-3xl mx-auto lg:mx-0 lg:max-w-2xl transition-all duration-700 delay-300 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 sm:mb-5 text-[#111]">
          About
        </h2>
        <div className="border border-[#4a90d9] p-4 sm:p-5 max-w-lg">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#222] font-normal">
            I build quiet, precise interfaces — the kind that get out of the way.
            Currently shaping front-end work for studios and independent brands.
            Development ongoing.
          </p>
        </div>
      </section>

      {/* Footer — stays at bottom via mt-auto on the container, or just flows naturally */}
        <footer className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 text-center text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#888]">
        <span>&copy; 2026 Nischal Rai</span>
      </footer>
    </div>
  );
}
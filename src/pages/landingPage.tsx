import { useState, useEffect } from 'react';
import CardArc7 from '../components/CardArc7';
import ShinyText from '../components/ShinyText';

import photo from '../assets/profile.jpg';
import photo1 from '../assets/image1.png';
import photo2 from '../assets/image2.png';
import photo3 from '../assets/image3.png';
import photo4 from '../assets/image4.png';
import photo5 from '../assets/image5.png';
import photo6 from '../assets/image6.png';
import Header from '../components/layout/Header';

const photos = [photo, photo1, photo2, photo3, photo4, photo5, photo6];

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

      <Header/>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Title with ShinyText */}
        <div 
          className={`flex flex-col items-center pt-6 sm:pt-8 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-center leading-[0.82] sm:leading-[0.85] tracking-[-0.02em]">
            <span className="block text-[clamp(3.2rem,14vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              <ShinyText
                text="Nischal"
                speed={2}
                delay={0}
                color="#0a0a0a"
                shineColor="#ff0000"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={true}
                className="font-bodoni-main"
              />
            </span>
            <span className="block text-[clamp(3.2rem,14vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              <ShinyText
                text="FuckingSucks"
                speed={2}
                delay={0.3}
                color="#0a0a0a"
                shineColor="#ff0000"
                spread={120}
                direction="right"
                yoyo={false}
                pauseOnHover={true}
                className="font-bodoni-main"
              />
            </span>
          </h1>
          
          <p className="mt-4 bg-red-300 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold text-[#555] text-center">
            FullStack developer
          </p>
        </div>

        {/* CardArc7 */}
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

      {/* About */}
      <section 
        className={`relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 max-w-3xl mx-auto lg:mx-0 lg:max-w-2xl transition-all duration-700 delay-300 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 sm:mb-5 text-[#111]">
          Brief Desc
        </h2>
        <div className="border border-[black] p-4 sm:p-5 max-w-lg">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#222] font-normal">
            Nischal FuckingSucks at coding but somehow ships MERN apps anyway. React on the face, Node in the back, MongoDB somewhere in the closet.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 text-center text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#888]">
        <span>&copy; 2026 Nischal Rai</span>
      </footer>
    </div>
  );
}
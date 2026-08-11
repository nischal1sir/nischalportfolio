import MorphButton from '../components/morphButton';

export default function Resume() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 min-h-[60vh] sm:min-h-[70vh]">
      
      <div className="text-center">
        <h1 className="font-bodoni-main text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] mb-4">
          Resume
        </h1>
        
        <p className="text-[13px] sm:text-[14px] text-[#666] mb-10 max-w-xs mx-auto">
          The formal version of me. Less fun, more facts.
        </p>

        <MorphButton
          href="/resume.pdf"
          download="Nischal_Rai_Resume.pdf"
        >
          Download Resume
        </MorphButton>

        <p className="mt-6 text-[11px] text-[#aaa] tracking-wide">
          PDF &bull; Last updated August 2026
        </p>
      </div>

      {/* Quick highlights */}
      <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl w-full">
        <div className="text-center border-t border-[#ddd] pt-6">
          <span className="block text-[24px] sm:text-[28px] font-light text-[#0a0a0a]">MERN</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#888]">Primary Stack</span>
        </div>
        <div className="text-center border-t border-[#ddd] pt-6">
          <span className="block text-[24px] sm:text-[28px] font-light text-[#0a0a0a]">Nepal</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#888]">Based In</span>
        </div>
        <div className="text-center border-t border-[#ddd] pt-6">
          <span className="block text-[24px] sm:text-[28px] font-light text-[#0a0a0a]">Open</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#888]">For Work</span>
        </div>
      </div>

    </section>
  );
}
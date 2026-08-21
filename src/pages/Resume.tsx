import MorphButton from '../components/morphButton';
import { useProfile } from '../hooks/usePortfolioData';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Resume() {
  usePageMeta({
    title: 'Resume',
    description: 'Download my resume / CV. The formal version — less fun, more facts.',
    path: '/resume',
  });

  const { profile } = useProfile();
  const resumeUrl = profile?.resume_url || '/resume.pdf';
  const locationText = profile?.location ? profile.location.split(',')[0] : 'Nepal';

  return (
    <section className="flex flex-col items-center justify-center px-4 sm:px-6 min-h-[60vh] py-16">
      <div className="text-center">
        <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] mb-4">
          Resume
        </h1>

        <p className="text-[13px] sm:text-[14px] text-[#666] mb-10 max-w-xs mx-auto">
          The formal version of me. Less fun, more facts.
        </p>

        <MorphButton href={resumeUrl} download="Nischal_Rai_Resume.pdf">
          Download Resume
        </MorphButton>

        <p className="mt-6 text-[11px] text-[#aaa] tracking-wide">
          PDF &bull; Dynamic Database Resume
        </p>
      </div>

      <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl w-full">
        <div className="text-center border-t border-[#ddd] pt-6">
          <span className="block text-[24px] sm:text-[28px] font-light text-[#0a0a0a]">MERN</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#888]">Primary Stack</span>
        </div>
        <div className="text-center border-t border-[#ddd] pt-6">
          <span className="block text-[24px] sm:text-[28px] font-light text-[#0a0a0a]">{locationText}</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#888]">Based In</span>
        </div>
        <div className="text-center border-t border-[#ddd] pt-6">
          <span className="block text-[24px] sm:text-[28px] font-light text-[#0a0a0a]">Intern</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#888]">Open To</span>
        </div>
      </div>
    </section>
  );
}

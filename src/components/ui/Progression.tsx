import { progression } from '../../data/profile';
import { useReveal } from '../../hooks/useReveal';
import { ArrowRightIcon } from './Icon';

export function Progression() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-2 sm:gap-x-4">
        {progression.map((step, i) => (
          <div
            key={step}
            className={`flex items-center gap-2 sm:gap-4 transition-all duration-700 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span className="px-4 py-2 rounded-full border border-[#ebebeb] bg-white text-[13px] sm:text-[14px] font-semibold text-[#171717]">
              {step}
            </span>
            {i < progression.length - 1 && (
              <ArrowRightIcon size={16} className="text-[#a1a1a1]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

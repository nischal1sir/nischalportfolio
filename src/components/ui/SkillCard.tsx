import type { Skill } from '../../types';

interface SkillCardProps {
  skill: Skill;
  compact?: boolean;
  showCategory?: boolean;
}

export function SkillCard({ skill, compact = false, showCategory = true }: SkillCardProps) {
  if (compact) {
    return (
      <div className="group relative p-3.5 rounded-xl bg-white border border-black hover:border-black transition-all duration-200 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-black truncate">
              {skill.name}
            </h4>
            {showCategory && (
              <p className="text-xs text-gray-600 truncate">
                {skill.category}
              </p>
            )}
          </div>

          {skill.level && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white text-black border border-black shrink-0">
              {skill.level}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-black hover:border-black transition-all duration-200 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-black">
              {skill.name}
            </h3>
            {showCategory && (
              <span className="text-xs font-semibold text-gray-600">
                {skill.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {skill.level && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white text-black border border-black">
                {skill.level}
              </span>
            )}
          </div>
        </div>

        {skill.description ? (
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
            {skill.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}


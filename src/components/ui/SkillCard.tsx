import type { Skill } from '../../types';

interface SkillCardProps {
  skill: Skill;
  compact?: boolean;
  showCategory?: boolean;
}

export function SkillCard({ skill, compact = false, showCategory = true }: SkillCardProps) {
  if (compact) {
    return (
      <div className="group relative p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-200 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {skill.name}
            </h4>
            {showCategory && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {skill.category}
              </p>
            )}
          </div>

          {skill.level && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-neutral-700 shrink-0">
              {skill.level}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-200 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {skill.name}
            </h3>
            {showCategory && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {skill.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {skill.is_featured && (
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-700">
                Featured
              </span>
            )}
            {skill.level && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-neutral-700">
                {skill.level}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {skill.description ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
            {skill.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

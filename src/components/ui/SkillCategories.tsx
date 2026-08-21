import Reveal from '../Reveal';
import { SkillCard } from './SkillCard';
import type { Skill } from '../../types';

export function SkillGroup({
  label,
  skills,
  reveal = true,
}: {
  label: string;
  skills: Skill[];
  reveal?: boolean;
}) {
  const body = (
    <div className="space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-gray-500 border-b border-gray-200 pb-2">
        {label} ({skills.length})
      </h3>
      {skills.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No skills added in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id || skill.name} skill={skill} showCategory={false} />
          ))}
        </div>
      )}
    </div>
  );

  return reveal ? <Reveal>{body}</Reveal> : body;
}

export function SkillCategories({
  skills,
  limit,
}: {
  skills: Skill[];
  limit?: number;
}) {
  // Dynamically extract categories present in the skills list
  const categoryMap = new Map<string, Skill[]>();

  skills.forEach((skill) => {
    const categoryName = skill.category || 'Other';
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, []);
    }
    categoryMap.get(categoryName)!.push(skill);
  });

  const categoryEntries = Array.from(categoryMap.entries());

  if (categoryEntries.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No skills available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {categoryEntries.map(([categoryLabel, categorySkills]) => {
        const displaySkills = limit ? categorySkills.slice(0, limit) : categorySkills;
        return (
          <SkillGroup
            key={categoryLabel}
            label={categoryLabel}
            skills={displaySkills}
          />
        );
      })}
    </div>
  );
}
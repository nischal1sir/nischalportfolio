import Reveal from '../Reveal';
import { TechTag } from './Section';

export function SkillGroup({
  label,
  items,
  reveal = true,
}: {
  label: string;
  items: { name: string; category: string }[];
  reveal?: boolean;
}) {
  const body = (
    <div className="p-5 sm:p-6 border border-[#ebebeb] rounded-lg bg-[#fafafa]">
      <h3 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 text-[#4d4d4d]">
        {label}
      </h3>
      {items.length === 0 ? (
        <p className="text-[13px] text-[#888888]">Nothing here yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {items.map((s) => (
            <TechTag key={s.name} name={s.name} />
          ))}
        </div>
      )}
    </div>
  );

  return reveal ? <Reveal>{body}</Reveal> : body;
}

const skillCategories = [
  { key: 'language', label: 'Languages' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'tools', label: 'Tools' },
  { key: 'learning', label: 'Learning' },
  { key: 'exploring', label: 'Exploring' },
];

function skillsByCategory(category: string, skills: { name: string; category: string }[]) {
  return skills.filter(s => s.category === category);
}

export function SkillCategories({
  skills,
  limit,
}: {
  skills: { name: string; category: string }[];
  limit?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
      {skillCategories.map((group) => {
        const items = limit ? skillsByCategory(group.key, skills).slice(0, limit) : skillsByCategory(group.key, skills);
        return <SkillGroup key={group.key} label={group.label} items={items} />;
      })}
    </div>
  );
}
import { useState, useEffect } from 'react';

interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'language';
}

const skills: Skill[] = [
  { name: 'JavaScript', category: 'language' },
  { name: 'Python', category: 'language' },
  { name: 'Java', category: 'language' },
  { name: 'React', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'HTML / CSS', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Express', category: 'backend' },
  { name: 'MongoDB', category: 'database' },
  { name: 'MySQL', category: 'database' },
  { name: 'Supabase', category: 'database' },
  { name: 'Git / GitHub', category: 'tools' },
  { name: 'Linux / CLI', category: 'tools' },
  { name: 'Figma', category: 'tools' },
  { name: 'VS Code', category: 'tools' },
];

const categories = {
  language: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools & Workflow',
};

export default function TechStack() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const grouped = Object.entries(categories).map(([key, label]) => ({
    label,
    items: skills.filter((s) => s.category === key),
  }));

  return (
    <section
      className={`relative z-10 px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 max-w-3xl mx-auto transition-all duration-700 ease-out ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h1 className="font-bodoni-main text-[clamp(2.5rem,8vw,4rem)] leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] mb-2">
        Tech Stack
      </h1>
      <p className="text-[13px] sm:text-[14px] text-[#666] mb-10">
        The tools I use to turn caffeine into code.
      </p>

      <div className="space-y-10">
        {grouped.map((group) => (
          <div key={group.label}>
            <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 text-[#111]">
              {group.label}
            </h2>
            <div className="border border-[#ddd] p-5 sm:p-6">
              <div className="flex flex-wrap gap-3">
                {group.items.map((skill) => (
                  <span
                    key={skill.name}
                    className="text-[13px] sm:text-[14px] text-[#222] bg-[#f0f0f0] px-3 py-1.5"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Currently Working On */}
      <div className="mt-10 border border-[#4a90d9] p-5 sm:p-6">
        <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 text-[#111]">
          Currently Working On
        </h2>
        <ul className="space-y-2 text-[14px] sm:text-[15px] text-[#222]">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 bg-[#4a90d9] rounded-full" />
            Python
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 bg-[#4a90d9] rounded-full" />
            LLMs
          </li>
        </ul>
      </div>

      {/* Also Exploring */}
      <div className="mt-6 border border-[#ddd] p-5 sm:p-6">
        <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 text-[#111]">
          Also Exploring
        </h2>
        <ul className="space-y-2 text-[14px] sm:text-[15px] text-[#222]">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 bg-[#aaa] rounded-full" />
            Next.js
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 bg-[#aaa] rounded-full" />
            Prisma
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 bg-[#aaa] rounded-full" />
            Docker
          </li>
        </ul>
      </div>
    </section>
  );
}
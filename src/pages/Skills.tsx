import { useState, useMemo } from 'react';
import { PageHero, PageSection } from '../components/ui/Page';
import { SectionHeading, TechTag } from '../components/ui/Section';
import { SkillCategories } from '../components/ui/SkillCategories';
import { Progression } from '../components/ui/Progression';
import { useSkills, useSoftSkills, useLearningItems, useExploringItems } from '../hooks/usePortfolioData';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';
import { Skeleton, TextLines } from '../components/ui/Skeleton';
import Reveal from '../components/Reveal';
import { Search } from 'lucide-react';

export default function Skills() {
  usePageMeta({
    title: 'Skills',
    description:
      'My technical stack — languages, frontend, backend, database and tools I work with, plus what I am currently learning and exploring.',
    path: '/skills',
  });

  const ready = useReady();
  const { skills, loading: skillsLoading } = useSkills({ activeOnly: true });
  const { skills: softSkills, loading: softSkillsLoading } = useSoftSkills();
  const { items: learningItems, loading: learningLoading } = useLearningItems();
  const { items: exploringItems, loading: exploringLoading } = useExploringItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from backend skills
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    skills.forEach((s) => {
      if (s.category) categories.add(s.category);
    });
    return Array.from(categories);
  }, [skills]);

  // Filter skills dynamically
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || s.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, selectedCategory]);

  const allLoading = skillsLoading || softSkillsLoading || learningLoading || exploringLoading;

  if (!ready) return <SkillsSkeleton />;

  if (allLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Skills"
        title="My technical stack"
        intro="Technologies I actively work with, grouped by area. Explore by category or search by framework and tools."
      />

      <PageSection className="pb-12">
        {/* Dynamic Category & Search Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-black shadow-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-white text-black border-2 border-black shadow-xs'
                  : 'bg-white text-[#4d4d4d] border border-gray-300 hover:border-black'
              }`}
            >
              All Stack ({skills.length})
            </button>

            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black border-2 border-black shadow-xs'
                    : 'bg-white text-[#4d4d4d] border border-gray-300 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search stack or tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>

        {/* Skill Cards Grid */}
        {filteredSkills.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-sm font-semibold mb-1">No matching skills found</p>
            <p className="text-xs text-gray-400">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <SkillCategories skills={filteredSkills} />
        )}
      </PageSection>

      {/* Soft Skills Section */}
      {softSkills.length > 0 && (
        <PageSection className="pb-12 mt-4">
          <Reveal>
            <SectionHeading
              eyebrow="Beyond code"
              title="Soft skills"
              description="The non-technical side that makes technical execution successful — communication, problem-solving, and collaboration."
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {softSkills.map((s) => (
              <Reveal key={s.id || s.name} delay={80}>
                <div className="p-5 sm:p-6 border border-black rounded-2xl bg-white shadow-xs">
                  <h3 className="text-[16px] font-bold text-black mb-2">{s.name}</h3>
                  <p className="text-[14px] text-gray-700 leading-relaxed">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </PageSection>
      )}

      {/* Currently Learning Section */}
      {learningItems.length > 0 && (
        <PageSection className="pb-12">
          <Reveal>
            <SectionHeading
              eyebrow="Always learning"
              title="Currently learning"
              description="What I'm actively working on right now — the focus areas I'm dedicating time to."
            />
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {learningItems.map((s) => (
              <Reveal key={s} delay={80}>
                <TechTag name={s} accent />
              </Reveal>
            ))}
          </div>
        </PageSection>
      )}

      {/* Also Exploring Section */}
      {exploringItems.length > 0 && (
        <PageSection className="pb-12">
          <Reveal>
            <SectionHeading
              eyebrow="Up next"
              title="Also exploring"
              description="Technologies and libraries I'm experimenting with in personal projects."
            />
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {exploringItems.map((s) => (
              <Reveal key={s} delay={80}>
                <TechTag name={s} />
              </Reveal>
            ))}
          </div>
        </PageSection>
      )}

      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
          <Progression />
        </div>
      </section>
    </>
  );
}

function SkillsSkeleton() {
  return (
    <>
      <section className="px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-8 sm:pb-10 max-w-6xl mx-auto space-y-6">
        <Skeleton height={16} width="50px" />
        <Skeleton height={48} width="50%" />
        <Skeleton height={20} width="80%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 pb-12 max-w-6xl mx-auto">
        <Skeleton height={400} width="100%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-8">
        <TextLines lines={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={140} width="100%" />
          ))}
        </div>
      </section>
    </>
  );
}
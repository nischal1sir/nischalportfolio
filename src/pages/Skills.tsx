import { PageHero, PageSection } from '../components/ui/Page';
import { SectionHeading, TechTag } from '../components/ui/Section';
import { SkillCategories } from '../components/ui/SkillCategories';
import { Progression } from '../components/ui/Progression';
import { useSkills, useSoftSkills, useLearningItems, useExploringItems } from '../hooks/usePortfolioData';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';
import { Skeleton } from '../components/ui/Skeleton';
import Reveal from '../components/Reveal';

export default function Skills() {
  usePageMeta({
    title: 'Skills',
    description:
      'My technical stack — languages, frontend, backend, database and tools I work with, plus what I am currently learning and exploring.',
    path: '/skills',
  });

  const ready = useReady();
  const { skills, loading: skillsLoading } = useSkills();
  const { skills: softSkills, loading: softSkillsLoading } = useSoftSkills();
  const { items: learningItems, loading: learningLoading } = useLearningItems();
  const { items: exploringItems, loading: exploringLoading } = useExploringItems();

  const allLoading = skillsLoading || softSkillsLoading || learningLoading || exploringLoading;

  if (!ready) return <SkillsSkeleton />;

  if (allLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Skills"
        title="My technical stack"
        intro="Technologies I actively work with, grouped by area. I focus on categories and tools rather than self-rated percentages — knowing a technology matters most when you can use it to build something."
      />

      <PageSection className="pb-12">
        <SkillCategories skills={skills} />
      </PageSection>

      <PageSection className="pb-12 mt-4">
        <Reveal>
          <SectionHeading
            eyebrow="Beyond code"
            title="Soft skills"
            description="The non-technical side that makes the technical work actually land — working with people, staying organized and adapting as things change."
          />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {softSkills.map((s) => (
            <Reveal key={s.id} delay={80}>
              <div className="p-5 sm:p-6 border border-[#ebebeb] rounded-lg bg-[#fafafa]">
                <h3 className="text-[16px] font-semibold text-[#171717] mb-2">{s.name}</h3>
                <p className="text-[14px] text-[#4d4d4d] leading-relaxed">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

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

      <PageSection className="pb-12">
        <Reveal>
          <SectionHeading
            eyebrow="Up next"
            title="Also exploring"
            description="Smaller technologies I've started looking into. Easy to add or remove over time."
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

      <PageSection className="pb-12 bg-[#fafafa] border-y border-[#ebebeb]">
        <Progression />
      </PageSection>
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

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-6">
        <TextLines lines={2} />
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={28} width={120} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-6">
        <TextLines lines={2} />
        <div className="flex flex-wrap gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={28} width={100} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb]">
        <Skeleton height={180} width="100%" />
      </section>
    </>
  );
}

// Import TextLines
import { TextLines } from '../components/ui/Skeleton';
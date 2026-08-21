import { PageHero, PageSection } from '../components/ui/Page';
import Reveal from '../components/Reveal';
import { SectionHeading, TechTag } from '../components/ui/Section';
import { useExperiences } from '../hooks/usePortfolioData';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';
import { Skeleton } from '../components/ui/Skeleton';

export default function Experience() {
  usePageMeta({
    title: 'Experience',
    description:
      'My development work — internship and freelance/project-based web development experience.',
    path: '/experience',
  });

  const ready = useReady();
  const { experiences, loading: experiencesLoading } = useExperiences();

  if (!ready) return <ExperienceSkeleton />;

  if (experiencesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="Background & Experience"
        intro="An honest look at the development work I've done — from a frontend internship to freelance projects. I'm continuously learning, building and growing through real work."
      />

      <PageSection className="pb-12">
        <Reveal>
          <SectionHeading
            title="Development experience"
            description="Project-based work where I've turned requirements into functional, responsive websites."
          />
        </Reveal>
      </PageSection>

      <PageSection className="pb-12">
        <div className="space-y-6">
          {experiences.map((exp) => (
            <Reveal key={exp.id}>
              <article className="p-6 sm:p-7 bg-white border border-[#ebebeb] rounded-lg">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <h3 className="text-[16px] font-semibold text-[#171717]">{exp.role}</h3>
                  <span className="text-[12px] text-[#888888]">{exp.period}</span>
                </div>
                <p className="text-[14px] text-[#4d4d4d] leading-relaxed mb-4">{exp.description}</p>
                <ul className="space-y-2 mb-5">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-[14px] text-[#4d4d4d]">
                      <span className="text-[#a1a1a1] mt-1">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((t) => (
                    <TechTag key={t} name={t} />
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[14px] text-[#888888] mb-4">No experience entries yet.</p>
          </div>
        )}
      </PageSection>
    </>
  );
}

function ExperienceSkeleton() {
  return (
    <>
      <section className="px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-8 sm:pb-10 max-w-6xl mx-auto space-y-6">
        <Skeleton height={16} width="80px" />
        <Skeleton height={48} width="60%" />
        <Skeleton height={20} width="90%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 pb-12 max-w-6xl mx-auto">
        <Skeleton height={16} width="150px" className="mb-8" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 pb-12 max-w-6xl mx-auto space-y-6">
        {[0, 1].map((i) => (
          <Skeleton key={i} height={220} width="100%" />
        ))}
      </section>
    </>
  );
}
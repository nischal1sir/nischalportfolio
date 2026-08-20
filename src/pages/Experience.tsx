import { PageHero, PageSection } from '../components/ui/Page';
import Reveal from '../components/Reveal';
import { SectionHeading, TechTag } from '../components/ui/Section';
import { useExperiences, useEducation } from '../hooks/usePortfolioData';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';
import { Skeleton, TextLines } from '../components/ui/Skeleton';
import { Dot } from 'lucide-react';

export default function Experience() {
  usePageMeta({
    title: 'Experience',
    description:
      'My development work — internship and freelance/project-based web development experience.',
    path: '/experience',
  });

  const ready = useReady();
  const { experiences, loading: experiencesLoading } = useExperiences();
  const { education, loading: educationLoading } = useEducation();

  const allLoading = experiencesLoading || educationLoading;

  if (!ready) return <ExperienceSkeleton />;

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

      {/* Education */}
      <PageSection className="pb-12 bg-[#fafafa] border-y border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Background"
            title="Education"
            description="Academic background and relevant coursework."
          />
        </Reveal>
        <div className="mt-8 relative pl-6 sm:pl-8 border-l border-[#ebebeb] space-y-8">
          {education.map((item) => {
            return (
              <Reveal key={item.id}>
                <div className="relative">
                  <span className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-3 h-3 rounded-full bg-[#0070f3] ring-4 ring-white" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#f1f5ff] text-[#0761d1] shrink-0">
                      <span className="text-xl">{item.icon}</span>
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-[17px] font-semibold text-[#171717]">{item.institution}</h3>
                      {item.status ? (
                        <span className="text-[12px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f5] text-[#4d4d4d]">
                          {item.status}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-[14px] text-[#4d4d4d] mb-2 pl-12">{item.degree}</p>
                  <p className="text-[12px] text-[#888888] mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-12">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-[#a1a1a1]">📅</span>
                      {item.period}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-[#a1a1a1]">📍</span>
                      {item.location}
                    </span>
                    {item.faculty ? (
                      <span className="text-[#a1a1a1]">&bull; Faculty: {item.faculty}</span>
                    ) : null}
                  </p>
                  <ul className="space-y-1.5 pl-12">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-[14px] text-[#4d4d4d]">
                        <Dot size={18} className="text-[#a1a1a1] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {item.subjects && item.subjects.length > 0 && (
                    <p className="mt-3 pl-12 text-[13px] text-[#888888]">
                      <strong>Subjects:</strong> {item.subjects.join(', ')}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
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

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb] space-y-8">
        <TextLines lines={2} />
        <div className="relative pl-6 sm:pl-8 border-l border-[#ebebeb] space-y-8">
          {[0, 1].map((i) => (
            <Skeleton key={i} height={160} width="100%" />
          ))}
        </div>
      </section>
    </>
  );
}
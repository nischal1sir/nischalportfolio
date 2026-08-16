import { PageHero, PageSection } from '../components/ui/Page';
import Reveal from '../components/Reveal';
import { SectionHeading, TechTag } from '../components/ui/Section';
import { experiences, type ExperienceData } from '../data/experience';
import { Briefcase } from 'lucide-react';
import { BriefcaseIcon, ExternalLinkIcon } from '../components/ui/Icon';
import { Dot, Rocket } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';
import { Skeleton, TextLines } from '../components/ui/Skeleton';

const typeMeta: Record<ExperienceData['type'], { label: string; icon: typeof Briefcase }> = {
  internship: { label: 'Internship', icon: Rocket },
  freelance: { label: 'Freelance', icon: Briefcase },
  role: { label: 'Role', icon: Briefcase },
};

export default function Experience() {
  usePageMeta({
    title: 'Experience',
    description:
      'My development work — internship and freelance/project-based web development experience.',
    path: '/experience',
  });

  const ready = useReady();
  if (!ready) return <ExperienceSkeleton />;

  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="Background & Experience"
        intro="An honest look at the development work I've done — from a frontend internship to freelance projects. I'm continuously learning, building and growing through real work."
      />

      <PageSection className="pb-12">
        <SectionHeading
          title="Development experience"
          description="Project-based work where I've turned requirements into functional, responsive websites."
        />
      </PageSection>

      <PageSection className="pb-16">
        <div className="space-y-6">
          {experiences.map((exp) => {
            const TypeIcon = typeMeta[exp.type].icon;
            return (
              <Reveal key={exp.id}>
                <article className="p-6 sm:p-7 bg-white border border-[#ebebeb] rounded-lg">
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#f5f5f5] text-[#171717] shrink-0">
                      <BriefcaseIcon size={20} />
                    </span>
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#171717]">{exp.role}</h3>
                      <p className="text-[13px] text-[#888888]">
                        {exp.companyUrl ? (
                          <>
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0070f3] hover:text-[#0761d1] inline-flex items-center gap-1 font-medium"
                            >
                              {exp.company}
                              <ExternalLinkIcon size={12} />
                            </a>
                            <span className="text-[#a1a1a1]"> &bull; {exp.location}</span>
                          </>
                        ) : (
                          <>
                            {exp.company} &bull; {exp.location}
                          </>
                        )}
                      </p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full bg-[#eef4ff] text-[#0761d1]">
                      <TypeIcon size={12} />
                      {typeMeta[exp.type].label}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#888888] mb-3">{exp.period}</p>
                  <p className="text-[14px] text-[#4d4d4d] leading-relaxed mb-4">{exp.description}</p>

                  <ul className="space-y-2 mb-5">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-[14px] text-[#4d4d4d]">
                        <Dot size={18} className="text-[#a1a1a1] shrink-0 mt-0.5" />
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
        <Skeleton height={16} width="100px" />
        <Skeleton height={48} width="60%" />
        <Skeleton height={20} width="90%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 pb-16 max-w-6xl mx-auto space-y-6">
        <TextLines lines={2} />
        <div className="space-y-6">
          {experiences.map((_, i) => (
            <Skeleton key={i} height={220} width="100%" />
          ))}
        </div>
      </section>
    </>
  );
}

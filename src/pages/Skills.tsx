import { PageHero, PageSection } from '../components/ui/Page';
import { SectionHeading, TechTag } from '../components/ui/Section';
import { SkillCategories } from '../components/ui/SkillCategories';
import { Progression } from '../components/ui/Progression';
import { currentlyLearning, exploring, softSkills } from '../data/skills';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Skills() {
  usePageMeta({
    title: 'Skills',
    description:
      'My technical stack — languages, frontend, backend, database and tools I work with, plus what I am currently learning and exploring.',
    path: '/skills',
  });

  return (
    <>
      <PageHero
        eyebrow="Skills"
        title="My technical stack"
        intro="Technologies I actively work with, grouped by area. I focus on categories and tools rather than self-rated percentages — knowing a technology matters most when you can use it to build something."
      />

      <PageSection className="pb-12">
        <SkillCategories />
      </PageSection>

      <PageSection className="pb-12 mt-4">
        <SectionHeading
          eyebrow="Beyond code"
          title="Soft skills"
          description="The non-technical side that makes the technical work actually land — working with people, staying organized and adapting as things change."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {softSkills.map((s) => (
            <div
              key={s.name}
              className="p-5 sm:p-6 border border-[#ebebeb] rounded-lg bg-[#fafafa]"
            >
              <h3 className="text-[16px] font-semibold text-[#171717] mb-2">{s.name}</h3>
              <p className="text-[14px] leading-relaxed text-[#4d4d4d]">{s.description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection className="pb-12 mt-4">
        <SectionHeading
          eyebrow="In progress"
          title="Currently learning"
          description="I keep a short list of things I'm actively digging into right now."
        />
        <div className="mt-6 flex flex-wrap gap-2.5">
          {currentlyLearning.map((s) => (
            <TechTag key={s} name={s} accent />
          ))}
        </div>
      </PageSection>

      <PageSection className="pb-12 mt-4">
        <SectionHeading
          eyebrow="Up next"
          title="Also exploring"
          description="Technologies I've started looking into and plan to go deeper on. Easy to add or remove over time."
        />
        <div className="mt-6 flex flex-wrap gap-2.5">
          {exploring.map((s) => (
            <TechTag key={s} name={s} />
          ))}
        </div>
      </PageSection>

      <PageSection className="pb-20 mt-4">
        <SectionHeading
          eyebrow="More than syntax"
          title="I don't just learn technologies — I learn how to use them to build things."
          align="center"
        />
        <div className="mt-10">
          <Progression />
        </div>
      </PageSection>
    </>
  );
}

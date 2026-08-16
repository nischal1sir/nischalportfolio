import { PageHero, PageSection } from '../components/ui/Page';
import Reveal from '../components/Reveal';
import { SectionHeading, ReadMoreLink, TechTag } from '../components/ui/Section';
import { LinkButton } from '../components/ui/Button';
import { Skeleton, TextLines } from '../components/ui/Skeleton';
import { philosophy, profile } from '../data/profile';
import { education } from '../data/education';
import { experiences } from '../data/experience';
import { currentlyLearning, exploring } from '../data/skills';
import { philosophyIconLib, ArrowRightIcon } from '../components/ui/Icon';
import { Dot, MapPin, Calendar } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';

const interests = [
  'Learning new programming concepts',
  'Exploring new technologies',
  'Building websites',
  'Solving problems',
  'Working on real projects',
  'Understanding how systems work',
  'Improving existing code',
  'Adapting to unfamiliar codebases',
];

export default function About() {
  usePageMeta({
    title: 'About',
    description:
      'About Nischal Rai — a hardworking, passionate developer who enjoys learning and adapting to new technologies.',
    path: '/about',
  });

  const ready = useReady();
  if (!ready) return <AboutSkeleton />;

  return (
    <>
      <PageHero
        eyebrow="About"
        title={profile.name}
        intro={profile.about}
      />

      {/* Who I am */}
      <PageSection className="py-12">
        <Reveal>
          <SectionHeading eyebrow="Who I am" title="A little more about me" />
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 text-[15px] sm:text-[16px] leading-relaxed text-[#4d4d4d] max-w-2xl">
            I'm a hardworking and passionate developer who enjoys learning and adapting to new
            technologies. Rather than presenting myself as someone who already knows everything, I
            focus on learning quickly, adapting to new tools and codebases, and building real
            projects to grow.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-4 text-[13px] uppercase tracking-[0.1em] text-[#888888] mb-4">
            Things I enjoy
          </p>
          <div className="flex flex-wrap gap-2.5">
            {interests.map((i) => (
              <TechTag key={i} name={i} />
            ))}
          </div>
        </Reveal>
      </PageSection>

      {/* Development philosophy */}
      <PageSection className="py-12 bg-[#fafafa] border-y border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Mindset"
            title="My development philosophy"
            description="How I think about building software and growing as a developer."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {philosophy.map((p, i) => {
            const Icon = philosophyIconLib[p.icon] ?? philosophyIconLib.hammer;
            return (
              <Reveal key={p.title} delay={i * 70}>
                <article className="group h-full p-6 bg-white border border-[#ebebeb] rounded-lg transition-all duration-300 hover:border-[#a1a1a1] hover:-translate-y-0.5">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#f5f5f5] text-[#171717] mb-4 transition-colors duration-300 group-hover:bg-[#171717] group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#171717] mb-2">{p.title}</h3>
                  <p className="text-[14px] leading-relaxed text-[#4d4d4d]">{p.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </PageSection>

      {/* Education */}
      <PageSection className="py-12">
        <Reveal>
          <SectionHeading eyebrow="Background" title="Education" />
        </Reveal>
        <div className="mt-8 relative pl-6 sm:pl-8 border-l border-[#ebebeb] space-y-8">
          {education.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.id}>
                <div className="relative">
                  <span className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-3 h-3 rounded-full bg-[#0070f3] ring-4 ring-white" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#f1f5ff] text-[#0761d1] shrink-0">
                      <Icon size={18} />
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
                      <Calendar size={13} className="text-[#a1a1a1]" />
                      {item.period}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} className="text-[#a1a1a1]" />
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
                </div>
              </Reveal>
            );
          })}
        </div>
      </PageSection>

      {/* Freelance experience */}
      <PageSection className="py-12 bg-[#fafafa] border-y border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Freelance development"
            description="Project-based work where I've turned requirements into functional, responsive websites."
          />
        </Reveal>
        <div className="mt-8 space-y-6">
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
        <div className="mt-8">
          <ReadMoreLink to="/experience">See full experience</ReadMoreLink>
        </div>
      </PageSection>

      {/* What I'm learning */}
      <PageSection className="py-12">
        <Reveal>
          <SectionHeading
            eyebrow="In progress"
            title="What I'm learning"
            description="I keep a short list of what I'm actively digging into, with a couple of technologies I'm exploring next."
          />
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          {currentlyLearning.map((s) => (
            <TechTag key={s} name={s} accent />
          ))}
          {exploring.map((s) => (
            <TechTag key={s} name={s} />
          ))}
        </div>
        <div className="mt-6">
          <ReadMoreLink to="/skills">View all skills</ReadMoreLink>
        </div>
      </PageSection>

      {/* Internship / career goals */}
      <PageSection className="py-14">
        <Reveal>
          <div className="p-8 sm:p-10 rounded-xl bg-[#171717] text-white flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#a1a1a1] mb-3">
                Open to opportunities
              </p>
              <h2 className="text-[clamp(1.5rem,3.5vw,2rem)] font-semibold leading-tight mb-3">
                Internship & career goals
              </h2>
              <p className="text-[15px] text-[#d4d4d4] leading-relaxed max-w-2xl">
                I'm currently open to internship opportunities where I can learn from experienced
                developers, contribute to real projects and grow as a software developer.
              </p>
            </div>
            <LinkButton to="/contact" variant="secondary" className="shrink-0 self-center">
              Let's Connect
              <ArrowRightIcon size={16} />
            </LinkButton>
          </div>
        </Reveal>
      </PageSection>
    </>
  );
}

function AboutSkeleton() {
  return (
    <>
      <section className="px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-8 sm:pb-10 max-w-6xl mx-auto space-y-6">
        <Skeleton height={16} width="80px" />
        <Skeleton height={48} width="60%" />
        <Skeleton height={20} width="90%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-6">
        <TextLines lines={2} />
        <TextLines lines={3} />
        <div className="flex flex-wrap gap-2.5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height={28} width={100} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb] space-y-8">
        <TextLines lines={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {philosophy.map((_, i) => (
            <Skeleton key={i} height={220} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-8">
        <TextLines lines={2} />
        <div className="relative pl-6 sm:pl-8 border-l border-[#ebebeb] space-y-8">
          {education.map((_, i) => (
            <Skeleton key={i} height={160} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb] space-y-8">
        <TextLines lines={2} />
        <div className="space-y-6">
          {experiences.map((_, i) => (
            <Skeleton key={i} height={220} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-6">
        <TextLines lines={2} />
        <div className="flex flex-wrap gap-3">
          {currentlyLearning.map((_, i) => (
            <Skeleton key={i} height={28} width={100} rounded="rounded-full" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {exploring.map((_, i) => (
            <Skeleton key={i} height={28} width={80} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 max-w-6xl mx-auto">
        <Skeleton height={180} width="100%" />
      </section>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShinyText from '../components/ShinyText';
import CardArc7 from '../components/CardArc7';
import Reveal from '../components/Reveal';
import { Button, LinkButton } from '../components/ui/Button';
import { SectionHeading, ReadMoreLink, TechTag } from '../components/ui/Section';
import { PageSection } from '../components/ui/Page';
import { ServiceCard } from '../components/ui/ServiceCard';
import { Progression } from '../components/ui/Progression';
import { FaqBlock } from '../components/ui/Faq';
import ProjectCard from '../components/ProjectCard';
import { Skeleton, TextLines } from '../components/ui/Skeleton';
import { profile } from '../data/profile';
import { services } from '../data/services';
import { skillsByCategory, softSkills } from '../data/skills';
import { currentlyLearning, exploring } from '../data/skills';
import { experiences } from '../data/experience';
import { projectsApi } from '../services/api';
import type { Project } from '../types';
import { ArrowRightIcon, DownloadIcon, MailIcon } from '../components/ui/Icon';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';

import photo from '../assets/profile.jpg';
import photo1 from '../assets/image1.png';
import photo2 from '../assets/image2.png';
import photo3 from '../assets/image3.png';
import photo4 from '../assets/image4.png';
import photo5 from '../assets/image5.png';
import photo6 from '../assets/image6.png';

const heroImages = [photo, photo1, photo2, photo3, photo4, photo5, photo6];

export default function Home() {
  usePageMeta({
    title: 'Nischal Rai | Developer',
    description:
      'Nischal Rai — a passionate developer building modern, responsive websites. Learn. Build. Adapt. Improve. Open to internships and freelance work.',
  });

  const ready = useReady();

  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    projectsApi
      .getFeatured()
      .then((data) => {
        if (cancelled) return;
        setFeaturedProjects(data.slice(0, 3));
        setProjectsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProjectsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return <HomeSkeleton />;$0

  return (
    <>
      {/* Hero */}
      <section className="relative px-5 sm:px-8 md:px-12 pt-10 sm:pt-16 lg:pt-20 pb-12 max-w-6xl mx-auto overflow-hidden">
        <div className="transition-all duration-700 ease-out opacity-100 translate-y-0">
          <div className="mb-6 flex justify-center md:hidden">
            <CardArc7 images={heroImages} />
          </div>
          <p className="text-[13px] sm:text-[14px] text-[#888888] mb-3">Hi, I'm</p>
          <ShinyText
            text={profile.name}
            className="font-display block text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95]"
            color="#171717"
            shineColor="#a1a1a1"
            speed={3}
          />
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            {profile.taglines.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                <span className="text-[16px] sm:text-[18px] font-medium text-[#171717]">{t}</span>
                {i < profile.taglines.length - 1 && (
                  <span className="text-[#a1a1a1]">•</span>
                )}
              </span>
            ))}
          </div>

          <h1 className="mt-5 sm:mt-6 text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#4d4d4d] max-w-2xl">
            {profile.headline}
          </h1>

          <p className="mt-5 max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-[#4d4d4d]">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton to="/projects" variant="primary">
              View My Work
              <ArrowRightIcon size={16} />
            </LinkButton>
            <LinkButton to="/contact" variant="secondary">
              <MailIcon size={16} />
              Let's Talk
            </LinkButton>
            <a
              href={profile.resumeUrl}
              download="Nischal_Rai_Resume.pdf"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors px-2"
            >
              <DownloadIcon size={16} />
              Download CV
            </a>
          </div>
        </div>

        {/* Hero photo fan */}
        <div className="hidden md:block absolute right-2 lg:right-12 top-16">
          <CardArc7 images={heroImages} />
        </div>
      </section>

      {/* Short introduction strip */}
      <PageSection className="py-6 border-y border-[#ebebeb] bg-[#fafafa]">
        <Reveal>
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#4d4d4d] max-w-3xl">
            {profile.about}{' '}
            <ReadMoreLink to="/about">Read More About Me</ReadMoreLink>
          </p>
        </Reveal>
      </PageSection>

      {/* Skills preview */}
      <PageSection className="py-14 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Skills"
            title="Technologies I work with"
            description="A quick look at the stack I use day to day — there's more in the full skills page."
          />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Reveal delay={60}>
            <div className="p-5 border border-[#ebebeb] rounded-lg bg-[#fafafa]">
              <h3 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 text-[#4d4d4d]">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsByCategory('language').map((s) => (
                  <TechTag key={s.name} name={s.name} />
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="p-5 border border-[#ebebeb] rounded-lg bg-[#fafafa]">
              <h3 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 text-[#4d4d4d]">
                Frontend
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsByCategory('frontend')
                  .slice(0, 2)
                  .map((s) => (
                    <TechTag key={s.name} name={s.name} />
                  ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="mt-5 p-5 border border-[#ebebeb] rounded-lg bg-[#fafafa]">
            <h3 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 text-[#4d4d4d]">
              Soft skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((s) => (
                <TechTag key={s.name} name={s.name} />
              ))}
            </div>
          </div>
        </Reveal>
        <div className="mt-6">
          <ReadMoreLink to="/skills">View All Skills</ReadMoreLink>
        </div>
      </PageSection>

      {/* Featured projects */}
      <PageSection className="py-14 sm:py-16 bg-[#fafafa] border-y border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Featured projects"
            description="A few projects that show how I approach building things."
          />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors"
          >
            View All Projects
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </PageSection>

      {/* What I can build */}
      <PageSection className="py-14 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="What I can build"
            description="I can build flexible, modern websites according to your requirements and budget. Here's what I can help with."
          />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </PageSection>

      {/* FAQ / What I can deliver */}
      <PageSection className="py-14 sm:py-16 bg-[#fafafa] border-y border-[#ebebeb]">
        <FaqBlock />
      </PageSection>

      {/* Currently learning */}
      <PageSection className="py-14 sm:py-16 bg-[#fafafa] border-y border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Always learning"
            title="Currently working on"
            description="Technology moves fast — I keep a short list of what I'm actively exploring right now."
          />
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          {currentlyLearning.map((s) => (
            <TechTag key={s} name={s} accent />
          ))}
        </div>
      </PageSection>

      {/* Also exploring */}
      <PageSection className="py-14 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Up next"
            title="Also exploring"
            description="Smaller technologies I've started looking into. Easy to add or remove over time."
          />
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {exploring.map((s) => (
            <TechTag key={s} name={s} />
          ))}
        </div>
      </PageSection>

      {/* Experience */}
      <PageSection className="py-14 sm:py-16 bg-[#fafafa] border-y border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Internship & project-based work"
          />
        </Reveal>
        <div className="mt-8 space-y-6">
          {experiences.map((exp) => (
            <Reveal key={exp.id}>
              <article className="p-6 sm:p-7 bg-white border border-[#ebebeb] rounded-lg">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <h3 className="text-[16px] font-semibold text-[#171717]">{exp.role}</h3>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      exp.type === 'internship'
                        ? 'bg-[#eef4ff] text-[#0761d1]'
                        : 'bg-[#f5f5f5] text-[#4d4d4d]'
                    }`}
                  >
                    {exp.type === 'internship' ? 'Internship' : 'Freelance'}
                  </span>
                </div>
                <p className="text-[12px] text-[#888888] mb-2">
                  {exp.companyUrl ? (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0070f3] hover:text-[#0761d1] font-medium"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}{' '}
                  &bull; {exp.period} &bull; {exp.location}
                </p>
                <p className="text-[14px] text-[#4d4d4d] leading-relaxed mb-4">{exp.description}</p>
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
          <ReadMoreLink to="/experience">Read More About My Experience</ReadMoreLink>
        </div>
      </PageSection>

      {/* Open to internship */}
      <PageSection className="py-14 sm:py-16">
        <Reveal>
          <div className="p-8 sm:p-10 rounded-xl bg-[#171717] text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="font-display-italic text-[14px] tracking-wide text-[#a1a1a1] mb-3">
                Open to opportunities
              </p>
              <h2 className="text-[clamp(1.5rem,3.5vw,2rem)] font-semibold leading-tight mb-3">
                Open to internship opportunities
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

      {/* Let's Talk CTA */}
      <PageSection className="py-14 sm:py-16 bg-[#fafafa] border-t border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Let's build something"
            eyebrowClass="font-display-italic !text-[15px] !tracking-wide !normal-case"
            title="Learn. Build. Adapt. Improve."
            titleClass="font-display"
            align="center"
            description="If you have a project in mind — or just want to connect — I'd love to hear from you."
          />
        </Reveal>
        <div className="mt-8">
          <Progression />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => {
              window.location.hash = '#/contact';
            }}
          >
            Let's Talk
            <ArrowRightIcon size={16} />
          </Button>
          <LinkButton to="/projects" variant="secondary">
            View My Work
            <ArrowRightIcon size={16} />
          </LinkButton>
        </div>
      </PageSection>
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <section className="px-5 sm:px-8 md:px-12 pt-10 sm:pt-16 lg:pt-20 pb-12 max-w-6xl mx-auto space-y-6">
        <Skeleton height={28} width="40%" className="mx-auto md:mx-0" />
        <Skeleton height={48} width="60%" className="mx-auto md:mx-0" />
        <Skeleton height={20} width="80%" className="mx-auto md:mx-0" />
        <Skeleton height={40} width="100%" />
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Skeleton height={40} width={120} rounded="rounded-full" />
          <Skeleton height={40} width={120} rounded="rounded-full" />
          <Skeleton height={40} width={140} rounded="rounded-full" />
        </div>
        <Skeleton height={200} width="100%" className="md:hidden" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-6 max-w-6xl mx-auto border-y border-[#ebebeb] bg-[#fafafa] space-y-4">
        <TextLines lines={2} />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto space-y-8">
        <TextLines lines={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[0, 1].map((i) => (
            <Skeleton key={i} height={160} width="100%" />
          ))}
        </div>
        <Skeleton height={120} width="100%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto border-y border-[#ebebeb] bg-[#fafafa] space-y-8">
        <TextLines lines={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={320} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto space-y-8">
        <TextLines lines={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((_, i) => (
            <Skeleton key={i} height={280} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb] space-y-8">
        <TextLines lines={2} />
        <Skeleton height={200} width="100%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb] space-y-6">
        <TextLines lines={2} />
        <div className="flex flex-wrap gap-3">
          {currentlyLearning.map((_, i) => (
            <Skeleton key={i} height={28} width={100} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto space-y-6">
        <TextLines lines={2} />
        <div className="flex flex-wrap gap-2.5">
          {exploring.map((_, i) => (
            <Skeleton key={i} height={28} width={80} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb] space-y-8">
        <TextLines lines={2} />
        <div className="space-y-6">
          {experiences.map((_, i) => (
            <Skeleton key={i} height={180} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto space-y-6">
        <Skeleton height={160} width="100%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto bg-[#fafafa] border-t border-[#ebebeb] space-y-8">
        <TextLines lines={2} />
        <Skeleton height={80} width="100%" />
        <div className="flex flex-wrap gap-3 justify-center">
          <Skeleton height={44} width={140} rounded="rounded-full" />
          <Skeleton height={44} width={140} rounded="rounded-full" />
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { PageHero, PageSection } from '../components/ui/Page';
import Reveal from '../components/Reveal';
import { SectionHeading, ReadMoreLink, TechTag } from '../components/ui/Section';
import { LinkButton } from '../components/ui/Button';
import { Skeleton, TextLines } from '../components/ui/Skeleton';
import { useProfile, usePhilosophy, useEducation, useLearningItems, useExploringItems, useAboutGalleryPreview } from '../hooks/usePortfolioData';
import { ArrowRightIcon } from '../components/ui/Icon';
import { Dot, MapPin, Calendar, GraduationCap, School, BookOpen, Shuffle, Hammer, Wrench, X, ZoomIn } from 'lucide-react';
import type { GalleryImage } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';

function renderEducationIcon(icon: any) {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in icon)) {
    const IconComp = icon;
    return <IconComp size={18} />;
  }
  if (typeof icon === 'string') {
    const lower = icon.toLowerCase();
    if (lower.includes('school')) return <School size={18} />;
    if (lower.includes('book')) return <BookOpen size={18} />;
    return <GraduationCap size={18} />;
  }
  return <GraduationCap size={18} />;
}

function renderPhilosophyIcon(icon: any) {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in icon)) {
    const IconComp = icon;
    return <IconComp size={20} />;
  }
  if (typeof icon === 'string') {
    const lower = icon.toLowerCase();
    if (lower.includes('book') || lower.includes('open') || lower.includes('learn')) return <BookOpen size={20} />;
    if (lower.includes('shuffle') || lower.includes('adapt')) return <Shuffle size={20} />;
    if (lower.includes('hammer') || lower.includes('build')) return <Hammer size={20} />;
    if (lower.includes('wrench') || lower.includes('tool')) return <Wrench size={20} />;
  }
  return <BookOpen size={20} />;
}

const defaultInterests = [
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
  const { profile, loading: profileLoading } = useProfile();
  const { items: philosophyItems, loading: philosophyLoading } = usePhilosophy();
  const { education, loading: educationLoading } = useEducation();
  const { items: learningItems, loading: learningLoading } = useLearningItems();
  const { items: exploringItems, loading: exploringLoading } = useExploringItems();
  const { previewImages = [], loading: previewLoading } = useAboutGalleryPreview();

  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const allLoading = profileLoading || philosophyLoading || educationLoading || learningLoading || exploringLoading || previewLoading;

  if (!ready) return <AboutSkeleton />;

  if (allLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to load profile</h1>
          <p className="text-gray-500">Please check your Supabase configuration.</p>
        </div>
      </div>
    );
  }

  const interestsList = (profile.interests && profile.interests.length > 0)
    ? profile.interests
    : defaultInterests;

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
            {interestsList.map((i) => (
              <TechTag key={i} name={i} />
            ))}
          </div>
        </Reveal>
      </PageSection>

      {/* Development philosophy */}
      <PageSection className="py-10 sm:py-12 bg-[#fafafa] border-y border-[#ebebeb]">
        <Reveal>
          <SectionHeading
            eyebrow="Mindset"
            title="My development philosophy"
            description="How I think about building software and growing as a developer."
          />
        </Reveal>
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {philosophyItems.map((p, i) => {
            return (
              <Reveal key={p.id} delay={i * 70}>
                <article className="group h-full p-5 sm:p-6 bg-white border border-[#ebebeb] rounded-xl transition-all duration-300 hover:border-[#a1a1a1] hover:shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#f1f5ff] text-[#0761d1] flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-[#0761d1] group-hover:text-white shrink-0">
                    {renderPhilosophyIcon(p.icon)}
                  </div>
                  <h3 className="text-[16px] sm:text-[17px] font-bold text-[#171717] mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#4d4d4d]">
                    {p.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </PageSection>

      {/* Education */}
      <PageSection className="py-12">
        <Reveal>
          <SectionHeading eyebrow="Background" title="Education" description="Academic background, qualifications, and ongoing coursework." />
        </Reveal>
        <div className="mt-8 relative pl-6 sm:pl-8 border-l-2 border-[#ebebeb] space-y-6">
          {education.map((item) => {
            return (
              <Reveal key={item.id}>
                <article className="relative bg-white border border-[#ebebeb] rounded-xl p-5 sm:p-6 shadow-sm hover:border-[#a1a1a1] transition-all">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-[#0070f3] ring-4 ring-white shrink-0" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#f3f4f6]">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f1f5ff] text-[#0761d1] flex items-center justify-center shrink-0">
                        {renderEducationIcon(item.icon)}
                      </div>
                      <div>
                        <h3 className="text-[17px] font-bold text-[#171717] tracking-tight leading-snug">
                          {item.institution}
                        </h3>
                        <p className="text-[14px] font-medium text-[#0761d1] mt-0.5">
                          {item.degree}
                        </p>
                      </div>
                    </div>
                    {item.status ? (
                      <span className="self-start sm:self-center px-2.5 py-1 text-[12px] font-medium rounded-full bg-[#f5f5f5] text-[#4d4d4d] border border-[#ebebeb] whitespace-nowrap">
                        {item.status}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#888888] mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-[#fafafa] px-2.5 py-1 rounded-md border border-[#ebebeb]">
                      <Calendar size={13} className="text-[#a1a1a1]" />
                      {item.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#fafafa] px-2.5 py-1 rounded-md border border-[#ebebeb]">
                      <MapPin size={13} className="text-[#a1a1a1]" />
                      {item.location}
                    </span>
                    {item.faculty ? (
                      <span className="inline-flex items-center gap-1.5 bg-[#fafafa] px-2.5 py-1 rounded-md border border-[#ebebeb] text-[#4d4d4d]">
                        Faculty: {item.faculty}
                      </span>
                    ) : null}
                  </div>

                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="space-y-2 text-[14px] text-[#4d4d4d]">
                      {item.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <Dot size={18} className="text-[#0761d1] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.subjects && item.subjects.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#f3f4f6] flex flex-wrap items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[#888888] mr-1">Relevant Subjects:</span>
                      {item.subjects.map((sub) => (
                        <span key={sub} className="text-[12px] px-2 py-0.5 rounded bg-[#f5f5f5] text-[#4d4d4d] font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
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
          {learningItems.map((s) => (
            <TechTag key={s} name={s} accent />
          ))}
          {exploringItems.map((s) => (
            <TechTag key={s} name={s} />
          ))}
        </div>
        <div className="mt-6">
          <ReadMoreLink to="/skills">View all skills</ReadMoreLink>
        </div>
      </PageSection>

      {/* About Page Gallery Preview Section (3 Admin-selected images) */}
      {previewImages.length > 0 && (
        <PageSection className="py-14 bg-[#fafafa] border-y border-[#ebebeb]">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#0070f3] font-semibold mb-1">
                  Selected Highlights
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  Gallery Preview
                </h2>
                <p className="text-sm text-[#666666] mt-1 max-w-xl">
                  A small preview of featured workspace setups and project snapshots selected from the main gallery.
                </p>
              </div>

              {/* View More Link Button to /about/gallery */}
              <LinkButton to="/about/gallery" variant="secondary" className="shrink-0">
                <span>View Full Gallery</span>
                <ArrowRightIcon size={16} />
              </LinkButton>
            </div>
          </Reveal>

          {/* 3-Image Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {previewImages.slice(0, 3).map((img, i) => (
              <Reveal key={img.id} delay={i * 80}>
                <div
                  onClick={() => setLightboxImage(img)}
                  className="group relative bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#0070f3] transition-all cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        objectFit: img.object_fit || 'cover',
                        objectPosition: img.object_position || 'center',
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="w-7 h-7 transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-medium rounded-full">
                      00{i + 1}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#0070f3] transition-colors">
                        {img.title}
                      </h3>
                      {img.description && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {img.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-[#0070f3] font-medium">
                      <span>{img.category}</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">Details ↗</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <LinkButton to="/about/gallery" variant="secondary" className="w-full justify-center">
              <span>View Full Gallery</span>
              <ArrowRightIcon size={16} />
            </LinkButton>
          </div>
        </PageSection>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-black overflow-hidden flex items-center justify-center max-h-[70vh]">
              <img
                src={lightboxImage.image_url}
                alt={lightboxImage.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-6 bg-white space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900">{lightboxImage.title}</h3>
                <span className="px-3 py-1 bg-blue-50 text-[#0070f3] text-xs font-semibold rounded-full">
                  {lightboxImage.category}
                </span>
              </div>
              {lightboxImage.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{lightboxImage.description}</p>
              )}
              {lightboxImage.tags && lightboxImage.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {lightboxImage.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          {[0, 1].map((i) => (
            <Skeleton key={i} height={220} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-8">
        <TextLines lines={2} />
        <div className="relative pl-6 sm:pl-8 border-l border-[#ebebeb] space-y-8">
          {[0, 1].map((i) => (
            <Skeleton key={i} height={160} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto bg-[#fafafa] border-y border-[#ebebeb] space-y-8">
        <TextLines lines={2} />
        <div className="space-y-6">
          {[0, 1].map((i) => (
            <Skeleton key={i} height={220} width="100%" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-12 max-w-6xl mx-auto space-y-6">
        <TextLines lines={2} />
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={28} width={100} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 max-w-6xl mx-auto">
        <Skeleton height={180} width="100%" />
      </section>
    </>
  );
}
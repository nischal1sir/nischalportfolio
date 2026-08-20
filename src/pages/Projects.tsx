import { memo } from 'react';
import { useProjects } from '../hooks/usePortfolioData';
import ProjectCard from '../components/ProjectCard';
import { PageHero, PageSection } from '../components/ui/Page';
import { SectionHeading } from '../components/ui/Section';
import { Skeleton } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReady } from '../hooks/useReady';

const Projects = () => {
  usePageMeta({
    title: 'Projects',
    description:
      'Projects I have built — full-stack apps, frontend work and side projects. Explore the code and live demos.',
    path: '/projects',
  });

  const ready = useReady();
  const { projects, loading, error } = useProjects(false);

  if (!ready) return <ProjectsSkeleton />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <PageSection className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-[14px] text-[#888888] mb-4">{error}</p>
        </div>
      </PageSection>
    );
  }

  // Get unique categories from projects
  const categories = [...new Set(projects.map(p => p.category))].sort();

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Projects"
        intro="A collection of projects I've built — from full-stack applications to frontend experiments. Each one taught me something new."
      />

      <PageSection className="py-14 sm:py-16 max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Filter"
            title="Browse by category"
          />
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          <CategoryFilter
            label="All"
            active={true}
            count={projects.length}
          />
          {categories.map((cat) => (
            <CategoryFilter
              key={cat}
              label={cat}
              active={false}
              count={projects.filter(p => p.category === cat).length}
            />
          ))}
        </div>
      </PageSection>

      <PageSection className="py-14 sm:py-16 max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="All projects"
            title={`Showing ${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          />
        </Reveal>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((p) => <ProjectCard key={p.id} project={p} />)
          ) : (
            <div className="col-span-full text-center py-16">
              <Skeleton height={40} width="200" className="mx-auto mb-4" />
              <p className="text-[14px] text-[#888888]">
                No projects yet. Add some in the admin panel!
              </p>
            </div>
          )}
        </div>
      </PageSection>
    </>
  );
};

// Helper component for category filter buttons
function CategoryFilter({ label, active, count }: { label: string; active: boolean; count: number }) {
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-[#171717] text-white'
          : 'bg-[#f5f5f5] text-[#4d4d4d] hover:bg-[#ebebeb]'
      }`}
    >
      {label}
      <span className="text-[11px] px-2 py-0.5 rounded-full text-xs font-mono">
        {count}
      </span>
    </button>
  );
}

// Import Reveal for use in the component
import Reveal from '../components/Reveal';

function ProjectsSkeleton() {
  return (
    <>
      <section className="px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-8 sm:pb-10 max-w-6xl mx-auto space-y-6">
        <Skeleton height={16} width="50px" />
        <Skeleton height={48} width="50%" />
        <Skeleton height={20} width="80%" />
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto">
        <Skeleton height={16} width="50px" className="mb-6" />
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={40} width={100} rounded="rounded-full" />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-12 py-14 sm:py-16 max-w-6xl mx-auto">
        <Skeleton height={16} width="80px" className="mb-6" />
        <Skeleton height={28} width="200" className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={320} width="100%" />
          ))}
        </div>
      </section>
    </>
  );
}

export default memo(Projects);
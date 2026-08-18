import { useEffect, useState } from 'react';
import { memo } from 'react';
import type { Project } from '../types';
import { projectsApi } from '../services/api';
import { projects as fallbackProjects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { PageHero, PageSection } from '../components/ui/Page';
import { SectionHeading } from '../components/ui/Section';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Folder,
  Globe,
  LayoutTemplate,
  Server,
  ShoppingCart,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const categoryIcon: Record<string, typeof Folder> = {
  'Full-Stack': Server,
  'Web App': LayoutTemplate,
  Frontend: Globe,
  Template: FileText,
  ECommerce: ShoppingCart,
  Chat: MessageSquare,
};

function iconForCategory(category: string) {
  const key = Object.keys(categoryIcon).find(
    (k) => category.toLowerCase().includes(k.toLowerCase()),
  );
  return key ? categoryIcon[key] : Folder;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const Projects = () => {
  usePageMeta({
    title: 'Projects',
    description:
      'Projects I have built — full-stack apps, frontend work and side projects. Explore the code and live demos.',
    path: '/projects',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus('loading');
      try {
        const data = await projectsApi.getAll();
        if (cancelled) return;
        if (data.length === 0) {
          setProjects(fallbackProjects);
          setUsingFallback(true);
          setStatus('success');
        } else {
          const same =
            data.length === fallbackProjects.length &&
            data.every((p) => fallbackProjects.some((f) => f.id === p.id));
          setUsingFallback(same);
          setProjects(data);
          setStatus('success');
        }
      } catch {
        if (cancelled) return;
        setProjects(fallbackProjects);
        setUsingFallback(true);
        setStatus('success');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Things I've built"
        intro="A collection of full-stack apps, frontend work and side projects. Each one taught me something new about writing clean, maintainable code."
      />

      <PageSection className="pb-20">
        {status === 'loading' ? (
          <LoadingState />
        ) : status === 'error' ? (
          <ErrorState onRetry={() => setStatus('idle')} />
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {usingFallback && (
              <p className="mb-8 text-[12px] text-[#888888] bg-[#fffbeb] border border-[#fde68a] rounded-lg px-4 py-3 inline-flex items-center gap-2">
                <FileText size={13} className="shrink-0" />
                Showing local project data (couldn't reach the API server).
              </p>
            )}
            <div className="mb-10 flex flex-wrap gap-2">
              {Array.from(new Set(projects.map((p) => p.category))).map((category) => {
                const Icon = iconForCategory(category);
                return (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ebebeb] bg-white text-[12px] font-medium text-[#4d4d4d]"
                  >
                    <Icon size={13} className="text-[#0070f3]" />
                    {category}
                  </span>
                );
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </PageSection>
    </>
  );
};

function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" aria-busy="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-xl border border-[#ebebeb] overflow-hidden">
          <div className="aspect-[16/10] w-full bg-[#f0f0f0] relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
          <div className="p-6 space-y-3">
            <Skeleton height={12} width={64} />
            <Skeleton height={20} width="75%" />
            <Skeleton height={12} width="100%" />
            <Skeleton height={12} width="66%" />
            <div className="flex gap-2 pt-2">
              <Skeleton height={24} width={64} rounded="rounded-full" />
              <Skeleton height={24} width={64} rounded="rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-16">
      <SectionHeading
        title="Couldn't load projects"
        description="Something went wrong while fetching projects. You can retry, or the local data will be shown instead."
        align="center"
      />
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center px-5 h-11 rounded-full bg-[#171717] text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <SectionHeading
        title="No projects yet"
        description="Projects are stored in a database. Add some from the admin panel to see them here."
        align="center"
      />
    </div>
  );
}

export default memo(Projects);

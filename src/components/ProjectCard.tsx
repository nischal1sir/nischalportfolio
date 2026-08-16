import { memo } from 'react';
import type { Project } from '../types';
import Reveal from './Reveal';
import { ArrowRightIcon, GithubIcon } from './ui/Icon';
import { Folder, Globe, LayoutTemplate, Server, ShoppingCart, MessageSquare, FileText } from 'lucide-react';

const categoryIcon: Record<string, typeof Folder> = {
  'Full-Stack': Server,
  'Web App': LayoutTemplate,
  Frontend: Globe,
  Template: FileText,
  ECommerce: ShoppingCart,
  Chat: MessageSquare,
};

function CategoryIcon({ category }: { category: string }) {
  const key = Object.keys(categoryIcon).find((k) =>
    category.toLowerCase().includes(k.toLowerCase()),
  );
  const Icon = key ? categoryIcon[key] : Folder;
  return <Icon size={11} className="text-[#0070f3]" />;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal>
      <article className="group flex flex-col h-full bg-white rounded-xl border border-[#ebebeb] overflow-hidden transition-all duration-300 hover:border-[#a1a1a1] hover:shadow-[0px_8px_24px_-8px_rgba(0,0,0,0.10)] hover:-translate-y-0.5">
        <div className="aspect-[16/10] overflow-hidden bg-[#f5f5f5]">
          <img
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#888888] mb-2 inline-flex items-center gap-1">
            <CategoryIcon category={project.category} />
            {project.category}
          </span>

          <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#171717] mb-2">
            {project.title}
          </h3>

          <p className="text-[13px] text-[#4d4d4d] leading-relaxed mb-4 flex-1">
            {project.short_description || project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.slice(0, 6).map((tech) => (
              <span key={tech} className="tag !text-[11px] !py-1 !px-2.5">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[#ebebeb]">
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors"
              >
                View Project
                <ArrowRightIcon size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors">
                View Project
                <ArrowRightIcon size={14} />
              </span>
            )}
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#4d4d4d] hover:text-[#171717] transition-colors"
                aria-label={`${project.title} source on GitHub`}
              >
                <GithubIcon size={14} />
                Code
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default memo(ProjectCard);

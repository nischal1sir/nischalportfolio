import { memo, useEffect, useState } from 'react';
import type { Project } from '../types';
import { projectsApi } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
      <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-8 sm:mb-10 text-[#111]">
        Projects
      </h2>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-[#888]">
          <p className="text-[14px] sm:text-[15px]">No projects yet. Add some from Supabase dashboard!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto w-full">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group bg-white border border-[#e0e0e0] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#111] hover:shadow-lg w-full max-w-4xl"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/2 md:min-h-[300px] aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 sm:p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-[#111] mb-3 group-hover:text-[#333] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#555] leading-relaxed mb-5">
                    {project.short_description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] sm:text-[12px] px-3 py-1 bg-[#f4f4f4] text-[#333] rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 6 && (
                      <span className="text-[11px] sm:text-[12px] px-3 py-1 bg-[#f4f4f4] text-[#888] rounded-full font-medium">
                        +{project.technologies.length - 6}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-[#eee]">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-[#111] hover:opacity-60 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Code
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-[#111] hover:opacity-60 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(Projects);
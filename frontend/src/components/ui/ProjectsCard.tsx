import { ExternalLinkIcon } from "@/components/icons";

interface Project {
  id: string;
  name: string;
  description?: string | null;
  url?: string | null;
  techStack: string[];
}

interface ProjectsCardProps {
  projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
  if (projects.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-bold text-slate-900 mb-4">Projects</h2>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-slate-200 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-bold text-slate-900">{project.name}</p>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            {project.description && (
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {project.description}
              </p>
            )}
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

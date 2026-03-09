interface SkillsCardProps {
  techStack: string[];
  title?: string;
}

export function SkillsCard({ techStack, title = "Skills & Tech Stack" }: SkillsCardProps) {
  if (techStack.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-bold text-slate-900 mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

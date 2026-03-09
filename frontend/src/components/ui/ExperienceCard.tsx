interface Experience {
  id: string;
  position: string;
  companyName: string;
  startYear: number;
  endYear?: number | null;
  description?: string | null;
}

interface ExperienceCardProps {
  experiences: Experience[];
}

function formatExperiencePeriod(startYear: number, endYear?: number | null) {
  if (endYear) {
    return `${startYear} – ${endYear}`;
  }
  return `${startYear} – Present`;
}

export function ExperienceCard({ experiences }: ExperienceCardProps) {
  if (experiences.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-bold text-slate-900 mb-5">Experience</h2>
      <div className="space-y-5">
        {experiences.map((exp, index) => {
          const isCurrent = !exp.endYear;
          return (
            <div key={exp.id} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1 ${
                    isCurrent ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                />
                {index < experiences.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 mt-1.5" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {exp.position}
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      {exp.companyName}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatExperiencePeriod(exp.startYear, exp.endYear)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

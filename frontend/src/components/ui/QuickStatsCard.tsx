interface QuickStatsCardProps {
  seniorityLevel?: string | null;
  projectsCount: number;
  techStackCount: number;
  location?: string | null;
}

function formatSeniorityLevel(level: string) {
  return level.replace(/_/g, " ");
}

export function QuickStatsCard({
  seniorityLevel,
  projectsCount,
  techStackCount,
  location,
}: QuickStatsCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-3">Quick stats</h3>
      <div className="space-y-2.5">
        {seniorityLevel && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Seniority</span>
            <span className="text-xs font-semibold text-slate-700">
              {formatSeniorityLevel(seniorityLevel)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Projects</span>
          <span className="text-xs font-semibold text-slate-700">
            {projectsCount} listed
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Stack size</span>
          <span className="text-xs font-semibold text-slate-700">
            {techStackCount} technologies
          </span>
        </div>
        {location && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Location</span>
            <span className="text-xs font-semibold text-slate-700">
              {location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

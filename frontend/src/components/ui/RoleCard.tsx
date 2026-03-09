import { CodeIcon, SearchIcon, CheckIcon } from "@/components/icons";
import { UserRole } from "@/lib/graphql";

interface RoleCardProps {
  role: UserRole;
  selected: boolean;
  onSelect: () => void;
}

const ROLE_CONFIG = {
  Developer: {
    icon: CodeIcon,
    title: "I'm a Developer",
    description: "Get discovered by top companies",
    features: ["Upload intro video", "Showcase your GitHub", "Get matched by AI"],
    selectedBg: "bg-indigo-50",
    selectedBorder: "border-indigo-400",
    selectedTitle: "text-indigo-600",
    iconBg: "bg-linear-to-br from-indigo-500 to-violet-600",
    checkBg: "bg-indigo-600",
  },
  Recruiter: {
    icon: SearchIcon,
    title: "I'm Hiring",
    description: "Find your perfect dev match",
    features: ["Browse developer feed", "AI-powered matching", "Shortlist & connect"],
    selectedBg: "bg-cyan-50",
    selectedBorder: "border-cyan-400",
    selectedTitle: "text-cyan-600",
    iconBg: "bg-linear-to-br from-cyan-500 to-teal-500",
    checkBg: "bg-cyan-500",
  },
} as const;

export function RoleCard({ role, selected, onSelect }: RoleCardProps) {
  const config = role === 'Developer' ? ROLE_CONFIG.Developer : ROLE_CONFIG.Recruiter;
  const Icon = config.icon;

  return (
    <button
      onClick={onSelect}
      className={`relative text-left p-6 rounded-2xl border-2 transition-all ${selected
        ? `${config.selectedBg} ${config.selectedBorder}`
        : "bg-gray-50 border-gray-200 hover:border-gray-300"
        }`}
    >
      {selected && (
        <div className={`absolute top-4 right-4 w-6 h-6 ${config.checkBg} rounded-full flex items-center justify-center`}>
          <CheckIcon className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${selected ? config.iconBg : "bg-gray-200"
        }`}>
        <Icon className={`w-9 h-9 ${selected ? "text-white" : "text-gray-500"}`} />
      </div>
      <h3 className={`text-lg font-extrabold mb-1 ${selected ? config.selectedTitle : "text-gray-800"}`}>
        {config.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{config.description}</p>
      <ul className="space-y-2">
        {config.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selected ? config.checkBg : "bg-gray-200"
              }`}>
              <CheckIcon className={`w-2.5 h-2.5 ${selected ? "text-white" : "text-gray-400"}`} />
            </div>
            <span className="text-xs font-medium text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

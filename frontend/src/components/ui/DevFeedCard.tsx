import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookmarkIcon } from "@/components/icons";
import { useShortlist } from "@/hooks/useShortlist";

interface Developer {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  location?: string | null;
  seniorityLevel?: string | null;
  techStack: string[];
  profilePhoto?: {
    url: string;
  } | null;
}

interface DevFeedCardProps {
  developer: Developer;
}

function DevFeedCard({ developer }: DevFeedCardProps) {
  const {
    isInShortlist,
    toggleShortlist,
    isLoading: shortlistLoading,
  } = useShortlist();

  const isShortlisted = isInShortlist(developer.id);
  const fullName = `${developer.firstName} ${developer.lastName}`.trim();

  function getInitials(firstName: string, lastName: string) {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
  }

  function formatSeniorityLevel(level: string) {
    return level.replace(/_/g, " ");
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <div className="flex gap-3 mb-3">
        <div className="shrink-0">
          {developer.profilePhoto?.url ? (
            <img
              src={developer.profilePhoto.url}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-100">
              <span className="text-sm font-bold text-white">
                {getInitials(developer.firstName, developer.lastName)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {fullName}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {developer.jobTitle || "Developer"}
          </p>
          <p className="text-xs text-slate-400">
            {[
              developer.location,
              developer.seniorityLevel && formatSeniorityLevel(developer.seniorityLevel),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>
      {developer.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {developer.techStack.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600"
            >
              {skill}
            </span>
          ))}
          {developer.techStack.length > 3 && (
            <span className="px-2 py-1 text-xs text-slate-400">
              +{developer.techStack.length - 3}
            </span>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <Link
          href={`/dashboard/developers/${developer.id}`}
          className="flex-1 flex items-center justify-center px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          View Profile
        </Link>
        <button
          onClick={() => toggleShortlist(developer.id)}
          disabled={shortlistLoading}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-50 ${
            isShortlisted
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <BookmarkIcon className="w-3 h-3" />
          {isShortlisted ? "Shortlisted" : "Shortlist"}
        </button>
      </div>
    </div>
  );
}

export default DevFeedCard;

import {
  MapPinIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from "@/components/icons";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  location?: string | null;
  seniorityLevel?: string | null;
  availabilityStatus?: string | null;
  profilePhotoUrl?: string | null;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
}

function formatSeniorityLevel(level: string) {
  return level.replace(/_/g, " ");
}

export function ProfileHeader({
  firstName,
  lastName,
  jobTitle,
  location,
  seniorityLevel,
  availabilityStatus,
  profilePhotoUrl,
}: ProfileHeaderProps) {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt={fullName}
              className="w-20 h-20 rounded-2xl border-2 border-slate-100 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getInitials(firstName, lastName)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {fullName}
          </h1>
          <p className="text-base font-medium text-slate-600">
            {jobTitle || "Developer"}
          </p>
          <div className="flex items-center gap-4 mt-3">
            {location && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPinIcon className="w-3.5 h-3.5" />
                {location}
              </div>
            )}
            {seniorityLevel && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <BriefcaseIcon className="w-3.5 h-3.5" />
                {formatSeniorityLevel(seniorityLevel)}
              </div>
            )}
            {availabilityStatus && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
                {availabilityStatus.replace(/_/g, " ")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

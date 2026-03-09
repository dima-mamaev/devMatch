import {
  GithubIcon,
  LinkedinIcon,
  ExternalLinkIcon,
} from "@/components/icons";

interface LinksCardProps {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  personalSiteUrl?: string | null;
}

export function LinksCard({
  githubUrl,
  linkedinUrl,
  personalSiteUrl,
}: LinksCardProps) {
  if (!githubUrl && !linkedinUrl && !personalSiteUrl) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-3">Links</h3>
      <div className="space-y-2">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
        )}
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
            LinkedIn
          </a>
        )}
        {personalSiteUrl && (
          <a
            href={personalSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ExternalLinkIcon className="w-4 h-4" />
            Website
          </a>
        )}
      </div>
    </div>
  );
}

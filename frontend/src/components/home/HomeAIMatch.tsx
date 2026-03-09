import { Button } from "@/components/ui/Button";
import {
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/components/icons";

const features = [
  {
    title: "Ranked results",
    description:
      "Developers ranked by compatibility with your exact requirements.",
  },
  {
    title: "Match percentage",
    description:
      "Clear scores that explain why each developer was recommended.",
  },
  {
    title: "Instant shortlisting",
    description: "Add any recommended developer to your shortlist in one click.",
  },
];

const devs = [
  { name: "Marcus Chen", match: 96, skills: "Next.js · NestJS · PostgreSQL" },
  { name: "Sophia Rodriguez", match: 88, skills: "React · TypeScript · GraphQL" },
]

export function HomeAIMatch() {

  return (
    <section className="bg-slate-50 border-y border-slate-200 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-indigo-100 rounded-[10px] flex items-center justify-center">
                  <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span className="text-base font-semibold text-slate-800">
                  AI Matching Assistant
                </span>
              </div>
              <span className="px-2 py-0.5 bg-green-50 rounded-full text-xs font-semibold text-green-600">
                Live
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                  <p className="text-sm leading-relaxed">
                    I need a senior Next.js + NestJS developer for a SaaS marketplace.
                    Must have PostgreSQL experience.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-indigo-100 rounded-full shrink-0 flex items-center justify-center">
                  <SparklesIcon className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-4 flex-1">
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    Found 3 matching developers. Here&apos;s your ranked shortlist:
                  </p>
                  <div className="space-y-2">
                    {devs.map((dev, i) =>
                      <div key={i} className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-indigo-50 rounded-full text-xs font-bold text-indigo-600">
                          {dev.match}%
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{dev.name}</p>
                          <p className="text-xs text-slate-400">{dev.skills}</p>
                        </div>
                        <Button variant="outline" size="xs" className="py-1">
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-slate-400">
                    Describe your ideal candidate...
                  </span>
                </div>
                <Button variant="primary" size="icon">
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
              AI Matching
            </p>
            <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight mb-5">
              Describe the role. AI does the matching.
            </h2>
            <p className="text-base text-slate-500 leading-relaxed mb-8">
              Simply describe your project requirements in plain English. Our AI
              analyzes skills, experience, and GitHub activity to return a ranked
              shortlist — with transparent reasoning.
            </p>
            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{feature.title}</p>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button href="/dashboard/ai-match" variant="primary" size="md">
              <SparklesIcon className="w-4 h-4" />
              Try AI Matching Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
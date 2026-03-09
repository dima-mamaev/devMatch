import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRightIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
  PlayIcon,
  CheckCircleIcon,
} from "@/components/icons";
import DevCard from "../ui/DevCard";

export function HomeIntro() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="primary">
              <StarIcon />
              AI-Powered Developer Hiring
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              Stop Guessing.{" "}
              <span className="text-indigo-600">Start Hiring</span> Smarter.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Discover developers through video. Validate through GitHub.
              Shortlist with AI. The modern hiring platform built for
              engineering teams.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/dashboard/developers">
                Explore Developers
                <ArrowRightIcon />
              </Button>
              <Button href="/dashboard/ai-match" variant="secondary">
                <SparklesIcon className="w-4 h-4 text-indigo-600" />
                Try AI Matching
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`/images/user_${i}.jpg`}
                    alt={`User ${i}`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Trusted by{" "}
                <span className="font-semibold text-gray-900">500+</span> tech teams
                worldwide
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 right-0 z-10 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">96% Match</p>
                <p className="text-xs text-gray-500">Marcus Chen</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded px-3 py-1">
                  <span className="text-xs text-gray-400">devmatch.io/app/feed</span>
                </div>
              </div>
              <div className="flex">
                <div className="w-12 bg-slate-800 py-3 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <ZapIcon />
                  </div>
                  <div className="w-6 h-6 bg-indigo-600/30 rounded" />
                  <div className="w-6 h-6 bg-white/10 rounded" />
                  <div className="w-6 h-6 bg-white/10 rounded" />
                </div>
                <div className="flex-1 bg-gray-50 p-3 flex gap-3">
                  <div className="w-24 h-full bg-slate-900 rounded-lg relative overflow-hidden">
                    <img
                      src="/images/user_preview.png"
                      alt="Developer preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <DevCard
                      name="Marcus Chen"
                      role="Senior Full-Stack Developer"
                      match={96}
                      skills={["Next.js", "NestJS"]}
                      image="/images/user_1.jpg"
                    />
                    <DevCard
                      name="Sophia Rodriguez"
                      role="Frontend Lead Engineer"
                      match={88}
                      skills={["React", "Vue.js"]}
                      image="/images/user_3.jpg"
                    />
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <SparklesIcon className="w-2.5 h-2.5 text-indigo-600" />
                        <span className="text-[10px] font-semibold text-indigo-600">
                          AI Match
                        </span>
                      </div>
                      <p className="text-[8px] text-gray-600">
                        Found 3 developers matching &quot;Senior Next.js + NestJS for SaaS...&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-13 -left-4 z-10 bg-white border border-gray-200 rounded-[14px] shadow-lg px-3.5 py-2 flex items-center gap-2">
              <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-semibold text-slate-700">
                AI shortlist ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}









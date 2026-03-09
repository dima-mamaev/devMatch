import { PlayIcon, CheckCircleIcon, SparklesIcon } from "@/components/icons";
import StepCard from "../ui/StepCard";

const steps = [
  {
    icon: PlayIcon,
    number: "01",
    title: "Watch",
    description:
      "Scroll through short developer intro videos. Get an authentic sense of communication skills and personality beyond the resume.",
  },
  {
    icon: CheckCircleIcon,
    number: "02",
    title: "Evaluate",
    description:
      "Review GitHub activity, LinkedIn profile, full tech stack, and download the CV — all in one place.",
  },
  {
    icon: SparklesIcon,
    number: "03",
    title: "Match",
    description:
      "Describe your project to the AI assistant. Get a ranked shortlist with match percentages and detailed reasoning.",
  },
];

export function HomeHIW() {
  return (
    <section className="py-20 px-6 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
            Hire in three simple steps
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
          >
            From discovery to decision — the entire hiring workflow in one focused platform.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
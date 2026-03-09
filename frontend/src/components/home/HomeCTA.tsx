import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/icons";

export function HomeCTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
            Ready to hire smarter?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Join 500+ tech teams using DevMatch to find and hire top developers
            faster. No job boards. No cold outreach. Just the right people,
            matched to your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/dashboard/developers">
              Explore Developers
              <ArrowRightIcon />
            </Button>
            <Button href="/dashboard/ai-match" variant="secondary">
              Try AI Matching
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

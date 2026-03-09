"use client";

import { ChevronRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import DevFeedCard from "../ui/DevFeedCard";
import { useGetDevelopersQuery } from "@/lib/graphql/generated";

export function HomeDevFeed() {
  const { data, loading } = useGetDevelopersQuery({
    variables: { paging: { page: 1, limit: 3 } },
  });

  const developers = data?.getDevelopers?.results ?? [];

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
              Developer Feed
            </p>
            <h2 className="text-[32px] font-bold text-slate-900 tracking-tight mb-4">
              Video-first developer profiles
            </h2>
            <p className="text-base text-slate-500 max-w-md">
              Watch short video intros. Filter by stack, experience, or location.
              Save the ones worth talking to.
            </p>
          </div>
          <Button
            href="/dashboard/developers"
            variant="outline"
            size="md"
            className="hidden md:inline-flex"
          >
            Browse all developers
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : developers.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-5">
            {developers.map((developer) => (
              <DevFeedCard key={developer.id} developer={developer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No developers available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

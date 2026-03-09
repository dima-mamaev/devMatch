"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserIcon } from "@/components/icons";
import { ShortlistCard } from "@/components/ui/ShortlistCard";
import { Pagination } from "@/components/ui/Pagination";
import { useShortlist } from "@/hooks/useShortlist";
import { useGetDevelopersQuery } from "@/lib/graphql/generated";

const ITEMS_PER_PAGE = 3;

export default function ShortlistPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    shortlistIds,
    shortlistCount,
    shortlistLoading,
    removeFromShortlist,
    isLoading: shortlistActionLoading,
  } = useShortlist();

  // Unified fetching using GetDevelopers with ids filter
  const { data, loading: developersLoading } = useGetDevelopersQuery({
    variables: {
      filter: { ids: shortlistIds },
      paging: { page: currentPage, limit: ITEMS_PER_PAGE },
    },
    skip: shortlistIds.length === 0,
    fetchPolicy: "cache-and-network",
  });

  const developers = data?.getDevelopers?.results ?? [];
  const totalPages = Math.ceil(shortlistCount / ITEMS_PER_PAGE);

  const handleRemove = async (developerId: string) => {
    await removeFromShortlist(developerId);
    // Reset to page 1 if current page becomes empty
    if (developers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const loading = shortlistLoading || developersLoading;
  const isEmpty = shortlistIds.length === 0;

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
        <div>
          <h1 className="text-base font-bold text-slate-900">Shortlist</h1>
          <p className="text-xs text-slate-400">
            {loading
              ? "Loading..."
              : `${shortlistCount} developer${shortlistCount !== 1 ? "s" : ""} shortlisted`}
          </p>
        </div>
      </div>
      <div className="p-6 max-w-5xl mx-auto">
        {loading && developers.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              No developers shortlisted
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Save developers from the feed to add them to your shortlist.
            </p>
            <Link
              href="/dashboard/developers"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Browse Developers
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {developers.map((developer) => (
                <ShortlistCard
                  key={developer.id}
                  developer={developer}
                  onRemove={handleRemove}
                  isLoading={shortlistActionLoading}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

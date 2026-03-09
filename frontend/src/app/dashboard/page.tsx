"use client";


import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardPage() {



  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
        <div>
          <h1 className="text-base font-bold text-slate-900">Developer Feed</h1>
          <p className="text-xs text-slate-400">3 of 6 developers</p>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`rounded-full ${i === 3 ? "w-5 h-1.5 bg-indigo-600" : "w-1.5 h-1.5 bg-slate-300"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex items-center justify-center h-[calc(100vh-56px)] p-6">
        <div className="text-center">

          <p className="text-slate-500">No user data available</p>

        </div>
      </div>
    </DashboardLayout>
  );
}

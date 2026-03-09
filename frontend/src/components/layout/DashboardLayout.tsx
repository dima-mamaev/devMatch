"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ZapIcon,
  PlayIcon,
  SparklesIcon,
  BookmarkIcon,
  UsersIcon,
  SettingsIcon,
  BellIcon,
  ArrowLeftIcon,
  UserIcon,
} from "@/components/icons";
import { useUser } from "@/hooks/useUser";
import type { UserRole } from "@/lib/graphql/generated";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Feed", icon: PlayIcon },
  { href: "/dashboard/ai-match", label: "AI Match", icon: SparklesIcon },
  { href: "/dashboard/shortlist", label: "Shortlist", icon: BookmarkIcon },
  { href: "/dashboard/developers", label: "Developers", icon: UsersIcon },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon, roles: ["Developer", "Recruiter"] },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon, roles: ["Developer", "Recruiter"] },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, profile, isAuthenticated } = useUser();

  const getInitials = () => {
    if (profile && "firstName" in profile && "lastName" in profile) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "G";
  };

  const getUserName = () => {
    if (profile && "firstName" in profile && "lastName" in profile) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return user?.email || "Guest";
  };

  const getUserRole = () => {
    return user?.role || (isAuthenticated ? "User" : "Guest");
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-100">
          <div className="w-7 h-7 bg-indigo-600 rounded-[10px] flex items-center justify-center">
            <ZapIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900">DevMatch</span>
        </div>
        <div className="px-3 pt-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
        <nav className="flex-1 px-3 pt-2">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              if (item.roles && !item.roles.includes(user?.role as UserRole)) {
                return null;
              }

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
            <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{getInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {getUserName()}
              </p>
              <p className="text-xs text-slate-400 truncate">{getUserRole()}</p>
            </div>
            <BellIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

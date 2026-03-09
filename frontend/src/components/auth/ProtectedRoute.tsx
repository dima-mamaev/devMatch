"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import type { UserRole } from "@/lib/graphql/generated";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  redirectTo = "/join",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoading, isGuest, isAuthenticated, user, isDeveloper, isRecruiter } = useUser();

  const hasRequiredRole = !requiredRoles || requiredRoles.some((role) =>
    (role === "Developer" && isDeveloper) ||
    (role === "Recruiter" && isRecruiter)
  );

  useEffect(() => {
    if (isLoading) return;

    if (isGuest) {
      router.push(redirectTo);
      return;
    }

    if (requiredRoles && isAuthenticated && !hasRequiredRole) {
      router.push("/dashboard");
    }
  }, [
    isLoading,
    isGuest,
    isAuthenticated,
    requiredRoles,
    hasRequiredRole,
    router,
    redirectTo,
  ]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (isGuest) {
    return null; // Will redirect in useEffect
  }

  // Check role if required
  if (requiredRoles && user && !hasRequiredRole) {
    const rolesText = requiredRoles.map((r) => r.toLowerCase() + "s").join(" or ");
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Access Denied
          </h2>
          <p className="text-sm text-slate-500">
            This page is only available for {rolesText}.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

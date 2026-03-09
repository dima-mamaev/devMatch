"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DeveloperProfile } from "@/components/profile/DeveloperProfile";
import { RecruiterProfile } from "@/components/profile/RecruiterProfile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  const { isDeveloper } = useUser();

  return (
    <ProtectedRoute requiredRoles={["Developer", "Recruiter"]}>
      <DashboardLayout>
        {isDeveloper ? <DeveloperProfile /> : <RecruiterProfile />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

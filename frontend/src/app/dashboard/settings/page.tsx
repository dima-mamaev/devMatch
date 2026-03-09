"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useDeleteAccountMutation } from "@/lib/graphql/generated";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SettingsPage() {
  const { logout } = useAuth();
  const { user, isDeveloper, isRecruiter } = useUser();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteAccount] = useDeleteAccountMutation();

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;

    setIsDeleting(true);
    try {
      await deleteAccount();
      logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={["Developer", "Recruiter"]}>
      <DashboardLayout>
        <div className="p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
            Settings
          </h1>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Account</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-medium text-slate-900">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Account type</span>
                <span className="text-sm font-medium text-slate-900">
                  {isDeveloper ? "Developer" : isRecruiter ? "Recruiter" : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Auth provider</span>
                <span className="text-sm font-medium text-slate-900 capitalize">
                  {user?.authProvider?.toLowerCase() || "—"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Session</h2>
            <p className="text-sm text-slate-500 mb-4">
              Sign out of your account on this device.
            </p>
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </div>
          <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-sm text-slate-500 mb-4">
              Once you delete your account, there is no going back. All your data will be permanently removed.
            </p>
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete account
              </Button>
            ) : (
              <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                <p className="text-sm font-medium text-red-800 mb-3">
                  Type <span className="font-bold">DELETE</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteInput("");
                    }}
                  >
                    Cancel
                  </Button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteInput !== "DELETE" || isDeleting}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Delete my account"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

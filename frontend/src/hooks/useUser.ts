"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useGetMeQuery, Developer, Recruiter, User } from "@/lib/graphql/generated";

/**
 * Single source of truth for user authentication state.
 * Combines Auth0 authentication with API user data.
 */
export function useUser() {
  const {
    isAuthenticated: auth0Authenticated,
    isLoading: auth0Loading,
    user: auth0User,
  } = useAuth0();

  const { data, loading: apiLoading } = useGetMeQuery({
    skip: !auth0Authenticated,
    fetchPolicy: "cache-first",
  });

  const isLoading = auth0Loading || (auth0Authenticated && apiLoading);
  const user = data?.user?.getMe ?? null;
  const profile = user?.profile ?? null;

  return {
    // Loading state
    isLoading,

    // Auth states (mutually exclusive when not loading)
    isGuest: !isLoading && !auth0Authenticated,
    isAuthenticated: !isLoading && !!user,

    // Email verification (from Auth0)
    isEmailVerified: auth0User?.email_verified ?? false,

    // User data
    user,
    profile,

    // Role helpers
    isDeveloper: user?.role === "Developer",
    isRecruiter: user?.role === "Recruiter",
  };
}

/**
 * Check if user is a guest (not authenticated)
 */
export function useIsGuest(): boolean {
  const { isGuest } = useUser();
  return isGuest;
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useUser();
  return isAuthenticated;
}

/**
 * Get developer profile (returns null if not a developer or not authenticated)
 */
export function useDeveloperProfile(): Developer | null {
  const { isAuthenticated, isDeveloper, profile } = useUser();
  if (isAuthenticated && isDeveloper && profile) {
    return profile as Developer;
  }
  return null;
}

/**
 * Get recruiter profile (returns null if not a recruiter or not authenticated)
 */
export function useRecruiterProfile(): Recruiter | null {
  const { isAuthenticated, isRecruiter, profile } = useUser();
  if (isAuthenticated && isRecruiter && profile) {
    return profile as Recruiter;
  }
  return null;
}

/**
 * Get current user (returns null if not authenticated)
 */
export function useCurrentUser(): User | null {
  const { user } = useUser();
  return user;
}

// Type exports for consumers
export type UserState = ReturnType<typeof useUser>;

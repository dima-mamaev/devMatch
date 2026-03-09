"use client";

import { UserRole } from "@/lib/graphql/generated";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";


const PENDING_ROLE_KEY = "devmatch_pending_role";

export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const signUp = useCallback(
    async (options?: {
      role?: UserRole;
      connection?: "google-oauth2" | "Username-Password-Authentication";
      email?: string;
    }) => {
      const { role = "Developer", connection, email } = options || {};

      // Store role in localStorage for after redirect
      if (typeof window !== "undefined") {
        localStorage.setItem(PENDING_ROLE_KEY, role);
      }

      await loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
          connection,
          login_hint: email,
        },
        appState: {
          returnTo: "/",
          role,
        },
      });
    },
    [loginWithRedirect]
  );

  const signIn = useCallback(
    async (options?: { connection?: "google-oauth2" }) => {
      await loginWithRedirect({
        authorizationParams: {
          connection: options?.connection,
        },
        appState: {
          returnTo: "/",
        },
      });
    },
    [loginWithRedirect]
  );

  const signInWithGoogle = useCallback(async () => {
    await signIn({ connection: "google-oauth2" });
  }, [signIn]);

  const signUpWithGoogle = useCallback(
    async (role: UserRole = "Developer") => {
      await signUp({ role, connection: "google-oauth2" });
    },
    [signUp]
  );

  const logout = useCallback(() => {
    // Clear pending role on logout
    if (typeof window !== "undefined") {
      localStorage.removeItem(PENDING_ROLE_KEY);
    }
    auth0Logout({
      logoutParams: {
        returnTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  }, [auth0Logout]);

  const getToken = useCallback(async () => {
    try {
      return await getAccessTokenSilently();
    } catch {
      return null;
    }
  }, [getAccessTokenSilently]);

  const getPendingRole = useCallback((): UserRole | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(PENDING_ROLE_KEY) as UserRole | null;
  }, []);

  const clearPendingRole = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PENDING_ROLE_KEY);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    signUp,
    signIn,
    signInWithGoogle,
    signUpWithGoogle,
    logout,
    getToken,
    getPendingRole,
    clearPendingRole,
  };
}

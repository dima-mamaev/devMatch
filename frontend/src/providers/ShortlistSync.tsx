"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import {
  useGetMyShortlistLazyQuery,
  useAddToShortlistMutation,
} from "@/lib/graphql/generated";
import {
  getLocalShortlist,
  clearLocalShortlist,
  getMergeAdditions,
} from "@/lib/localShortlist";

interface ShortlistSyncProps {
  children: React.ReactNode;
}

/**
 * Syncs localStorage shortlist to API when user logs in.
 * Must be placed inside both Auth0Provider and ApolloProvider.
 */
const VERIFICATION_TOAST_SHOWN_KEY = "devmatch_verification_toast_shown";

export function ShortlistSync({ children }: ShortlistSyncProps) {
  const { isAuthenticated, isLoading: auth0Loading, user: auth0User, logout } = useAuth0();
  const hasSyncedShortlist = useRef(false);
  const prevAuthenticated = useRef(false);

  const [getMyShortlist] = useGetMyShortlistLazyQuery({
    fetchPolicy: "network-only",
  });

  const [addToShortlistMutation] = useAddToShortlistMutation();

  // Store Apollo functions in refs to avoid dependency issues
  const getMyShortlistRef = useRef(getMyShortlist);
  getMyShortlistRef.current = getMyShortlist;
  const addToShortlistRef = useRef(addToShortlistMutation);
  addToShortlistRef.current = addToShortlistMutation;

  // Sync local shortlist to API after successful login
  const syncLocalShortlist = useCallback(async () => {
    if (hasSyncedShortlist.current) return;

    const localIds = getLocalShortlist();
    if (localIds.length === 0) {
      hasSyncedShortlist.current = true;
      return;
    }

    try {
      // Fetch current API shortlist
      const { data: shortlistData } = await getMyShortlistRef.current();
      const apiIds = (shortlistData?.getMyShortlist ?? []).map(
        (entry) => entry.developer.id
      );

      // Calculate what needs to be synced
      const idsToAdd = getMergeAdditions(localIds, apiIds);

      if (idsToAdd.length === 0) {
        clearLocalShortlist();
        hasSyncedShortlist.current = true;
        return;
      }

      // Add each developer to API shortlist
      const results = await Promise.allSettled(
        idsToAdd.map((developerId) =>
          addToShortlistRef.current({ variables: { developerId } })
        )
      );

      const successCount = results.filter((r) => r.status === "fulfilled").length;

      // Don't clear localStorage if all failed - will retry next login
      if (successCount === 0) {
        return;
      }

      // Clear localStorage after successful sync
      clearLocalShortlist();
      hasSyncedShortlist.current = true;
    } catch (err) {
      console.error("[ShortlistSync] Failed to sync shortlist:", err);
      toast.error("Failed to sync shortlist", {
        description: "Your saved developers will be synced next time you log in.",
      });
      // Keep localStorage for retry
    }
  }, []);

  // Handle unverified email - show toast and logout
  useEffect(() => {
    if (auth0Loading) return;

    if (isAuthenticated && auth0User && auth0User.email_verified === false) {
      const hasShownToast = sessionStorage.getItem(VERIFICATION_TOAST_SHOWN_KEY);
      if (!hasShownToast) {
        sessionStorage.setItem(VERIFICATION_TOAST_SHOWN_KEY, "true");
        toast.warning("Please verify your email to continue", {
          description: "Check your inbox and click the verification link, then sign in again",
          duration: 10000,
        });
        logout({ openUrl: false });
      }
    }
  }, [auth0Loading, isAuthenticated, auth0User, logout]);

  // Reset session storage flag on logout
  useEffect(() => {
    if (!isAuthenticated && !auth0Loading) {
      sessionStorage.removeItem(VERIFICATION_TOAST_SHOWN_KEY);
    }
  }, [isAuthenticated, auth0Loading]);

  // Trigger shortlist sync when user becomes authenticated
  useEffect(() => {
    if (auth0Loading) return;

    // Reset sync flag when user logs out
    if (!isAuthenticated) {
      hasSyncedShortlist.current = false;
      prevAuthenticated.current = false;
      return;
    }

    // Only sync if email is verified
    if (isAuthenticated && auth0User?.email_verified && !prevAuthenticated.current) {
      prevAuthenticated.current = true;
      // Small delay to ensure Apollo client has the auth token
      const timeoutId = setTimeout(() => {
        syncLocalShortlist();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [auth0Loading, isAuthenticated, auth0User, syncLocalShortlist]);

  return <>{children}</>;
}

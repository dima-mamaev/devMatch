import { useCallback, useState, useEffect, useRef } from "react";
import { useUser } from "./useUser";

// Stable empty array reference to avoid infinite re-renders
const EMPTY_ARRAY: string[] = [];
const EMPTY_SHORTLIST_ARRAY: never[] = [];
import {
  useGetMyShortlistQuery,
  useGetMyShortlistCountQuery,
  useIsInMyShortlistQuery,
  useAddToShortlistMutation,
  useRemoveFromShortlistMutation,
  useClearMyShortlistMutation,
} from "@/lib/graphql/generated";
import {
  getLocalShortlist,
  addToLocalShortlist,
  removeFromLocalShortlist,
  isInLocalShortlist,
  clearLocalShortlist,
  MAX_SHORTLIST_SIZE,
} from "@/lib/localShortlist";

export function useShortlist() {
  const { isGuest, isLoading: userLoading } = useUser();

  // Local state for localStorage shortlist (for reactivity)
  const [localShortlistIds, setLocalShortlistIds] = useState<string[]>([]);

  // Use guest status to determine local mode (guest = localStorage, authenticated = API)
  const isLocalMode = isGuest;

  // Initialize local shortlist state on mount (client-side only)
  useEffect(() => {
    if (isLocalMode) {
      setLocalShortlistIds(getLocalShortlist());
    }
  }, [isLocalMode]);

  // API queries/mutations (only used when authenticated)
  const {
    data: shortlistData,
    loading: shortlistLoading,
    refetch: refetchShortlist,
  } = useGetMyShortlistQuery({
    fetchPolicy: "cache-and-network",
    skip: isLocalMode || userLoading,
  });

  const {
    data: countData,
    refetch: refetchCount,
  } = useGetMyShortlistCountQuery({
    fetchPolicy: "cache-and-network",
    skip: isLocalMode || userLoading,
  });

  const [addToShortlistMutation, { loading: addingToShortlist }] =
    useAddToShortlistMutation();

  const [removeFromShortlistMutation, { loading: removingFromShortlist }] =
    useRemoveFromShortlistMutation();

  const [clearShortlistMutation, { loading: clearingShortlist }] =
    useClearMyShortlistMutation();

  // Store Apollo functions in refs to avoid dependency issues
  const refetchShortlistRef = useRef(refetchShortlist);
  refetchShortlistRef.current = refetchShortlist;
  const refetchCountRef = useRef(refetchCount);
  refetchCountRef.current = refetchCount;
  const addToShortlistMutationRef = useRef(addToShortlistMutation);
  addToShortlistMutationRef.current = addToShortlistMutation;
  const removeFromShortlistMutationRef = useRef(removeFromShortlistMutation);
  removeFromShortlistMutationRef.current = removeFromShortlistMutation;
  const clearShortlistMutationRef = useRef(clearShortlistMutation);
  clearShortlistMutationRef.current = clearShortlistMutation;

  // API shortlist data
  const apiShortlist = shortlistData?.getMyShortlist ?? [];
  const apiShortlistCount = countData?.getMyShortlistCount ?? 0;

  // Computed values based on mode
  const shortlistCount = isLocalMode ? localShortlistIds.length : apiShortlistCount;
  const isFull = shortlistCount >= MAX_SHORTLIST_SIZE;

  const isInShortlist = useCallback(
    (developerId: string) => {
      if (isLocalMode) {
        return localShortlistIds.includes(developerId);
      }
      return apiShortlist.some((entry) => entry.developer.id === developerId);
    },
    [isLocalMode, localShortlistIds, apiShortlist]
  );

  const addToShortlist = useCallback(
    async (developerId: string) => {
      if (isLocalMode) {
        const success = addToLocalShortlist(developerId);
        if (success) {
          setLocalShortlistIds(getLocalShortlist());
        }
        return success;
      }

      try {
        await addToShortlistMutationRef.current({
          variables: { developerId },
        });
        refetchShortlistRef.current();
        refetchCountRef.current();
        return true;
      } catch (error) {
        console.error("Failed to add to shortlist:", error);
        return false;
      }
    },
    [isLocalMode]
  );

  const removeFromShortlist = useCallback(
    async (developerId: string) => {
      if (isLocalMode) {
        removeFromLocalShortlist(developerId);
        setLocalShortlistIds(getLocalShortlist());
        return true;
      }

      try {
        await removeFromShortlistMutationRef.current({
          variables: { developerId },
        });
        refetchShortlistRef.current();
        refetchCountRef.current();
        return true;
      } catch (error) {
        console.error("Failed to remove from shortlist:", error);
        return false;
      }
    },
    [isLocalMode]
  );

  const toggleShortlist = useCallback(
    async (developerId: string) => {
      if (isInShortlist(developerId)) {
        return removeFromShortlist(developerId);
      } else {
        return addToShortlist(developerId);
      }
    },
    [isInShortlist, addToShortlist, removeFromShortlist]
  );

  const clearShortlistAction = useCallback(async () => {
    if (isLocalMode) {
      clearLocalShortlist();
      setLocalShortlistIds([]);
      return true;
    }

    try {
      await clearShortlistMutationRef.current();
      refetchShortlistRef.current();
      refetchCountRef.current();
      return true;
    } catch (error) {
      console.error("Failed to clear shortlist:", error);
      return false;
    }
  }, [isLocalMode]);

  return {
    // For authenticated users, return the full shortlist entries
    // For local mode, return the IDs array (component will need to fetch developer details)
    shortlist: isLocalMode ? EMPTY_SHORTLIST_ARRAY : apiShortlist,
    localShortlistIds: isLocalMode ? localShortlistIds : EMPTY_ARRAY,
    shortlistCount,
    shortlistLoading: isLocalMode ? false : (shortlistLoading || userLoading),
    isFull,
    maxSize: MAX_SHORTLIST_SIZE,
    isInShortlist,
    addToShortlist,
    removeFromShortlist,
    toggleShortlist,
    clearShortlist: clearShortlistAction,
    isLoading: addingToShortlist || removingFromShortlist || clearingShortlist,
    isLocalMode,
  };
}

/**
 * Hook to check if a specific developer is in the shortlist
 * More efficient for single developer checks
 */
export function useIsInShortlist(developerId: string) {
  const { isGuest, isLoading: userLoading } = useUser();
  const isLocalMode = isGuest;

  // Local state for localStorage check
  const [localIsIn, setLocalIsIn] = useState(false);

  useEffect(() => {
    if (isLocalMode) {
      setLocalIsIn(isInLocalShortlist(developerId));
    }
  }, [isLocalMode, developerId]);

  const { data, loading, refetch } = useIsInMyShortlistQuery({
    variables: { developerId },
    skip: !developerId || isLocalMode || userLoading,
    fetchPolicy: "cache-and-network",
  });

  // Store refetch in ref
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  // Refetch function that also updates local state
  const refetchAll = useCallback(() => {
    if (isLocalMode) {
      setLocalIsIn(isInLocalShortlist(developerId));
    } else {
      refetchRef.current();
    }
  }, [isLocalMode, developerId]);

  return {
    isInShortlist: isLocalMode ? localIsIn : (data?.isInMyShortlist ?? false),
    loading: isLocalMode ? false : loading,
    refetch: refetchAll,
  };
}

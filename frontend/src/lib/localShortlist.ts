/**
 * localStorage utilities for shortlist management for non-authenticated users.
 * Allows users to save developers to a local shortlist before signing in.
 */

const STORAGE_KEY = "devmatch_local_shortlist";

/**
 * Safely check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get stored developer IDs from localStorage
 */
export function getLocalShortlist(): string[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter to ensure all items are strings
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

/**
 * Add a developer to the local shortlist
 * @returns true if added successfully, false if already exists
 */
export function addToLocalShortlist(developerId: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const current = getLocalShortlist();

    // Already in shortlist
    if (current.includes(developerId)) {
      return false;
    }

    const updated = [...current, developerId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a developer from the local shortlist
 */
export function removeFromLocalShortlist(developerId: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const current = getLocalShortlist();
    const updated = current.filter((id) => id !== developerId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail
  }
}

/**
 * Check if a developer is in the local shortlist
 */
export function isInLocalShortlist(developerId: string): boolean {
  const current = getLocalShortlist();
  return current.includes(developerId);
}

/**
 * Clear all developers from the local shortlist
 */
export function clearLocalShortlist(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Calculate which local IDs should be synced to the API.
 * Deduplicates IDs already in the API shortlist.
 * @param localIds - IDs from localStorage
 * @param apiIds - IDs already in the API shortlist
 * @returns Array of IDs to add to the API
 */
export function getMergeAdditions(localIds: string[], apiIds: string[]): string[] {
  // Filter out duplicates (IDs already in API)
  return localIds.filter((id) => !apiIds.includes(id));
}

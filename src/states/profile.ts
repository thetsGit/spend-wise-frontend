import { signal, computed, batch } from "@preact/signals-core";
import { toast } from "sonner";

import type { User } from "@/types/entities";

import { getProfile } from "@/api/app-services";

import { accessToken } from "./oauth";

const PROFILE_KEY = "profile-key";

/**
 * Persist layer
 */

const getPersistedProfileDataStr = () => localStorage.getItem(PROFILE_KEY);
const deletePersistedProfileDataStr = () =>
  localStorage.removeItem(PROFILE_KEY);

const persistedProfileData = (() => {
  const profileDataString = getPersistedProfileDataStr();
  if (!profileDataString) return;
  return JSON.parse(profileDataString) as User;
})();

/**
 * Signals
 */

const loaded = signal(false);
const fetching = signal(false);
const data = signal<User | undefined>(persistedProfileData);
const error = signal<string>();

export const profile = computed(() => ({
  loaded: !!data.value,
  fetching: fetching.value,
  loading: fetching.value && !loaded.value,
  data: data.value,
  error: error.value,
}));

/**
 * Actions
 */

export const refreshProfile = async () => {
  fetching.value = true;

  try {
    const { request, resolver, errorResolver } = getProfile();

    const response = await request();

    const errorResponse = errorResolver(response);

    if (errorResponse) {
      error.value = errorResponse.error;
      toast.error(errorResponse.message);
      return;
    }

    const resolved = resolver(response);

    batch(() => {
      data.value = resolved;
      fetching.value = false;
      loaded.value = true;
    });
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to fetch profile";

    toast.error(error.value);

    return Promise.reject(err);
  } finally {
    fetching.value = false;
  }
};

/**
 * Subscribers
 */

accessToken.subscribe((token) => {
  if (!token) {
    // Flush profile if accessToken is flushed
    profile.value.data = undefined;
  } else {
    refreshProfile();
  }
});

data.subscribe((value) => {
  if (!value) {
    deletePersistedProfileDataStr();
    return;
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(value));
});

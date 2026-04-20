import { toast } from "sonner";
import pkceChallenge from "pkce-challenge";
import { batch, computed, signal } from "@preact/signals-core";

import { isFetchError } from "@/types/api";

import {
  OAUTH_AUTH_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE,
  OAUTH_REDIRECT_URI,
  OAUTH_SCOPES,
} from "@/constants/oauth";

import type { OauthTokenErrorResponse, OauthTokenResponse } from "@/api/types";

import { exchangeToken as exchangeTokenService } from "@/api/oauth-services";
import { verifyOauth, logout as logoutService } from "@/api/app-services";

type AccessToken = string;
type CodeVerifier = string;

/**
 * Persist layer
 */

const ACCESS_TOKEN_KEY = "access-token-key";
const CODE_VERIFIER_KEY = "code-verifier-key";

const getPersistedAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;

const getPersistedCodeVerifier = () =>
  sessionStorage.getItem(CODE_VERIFIER_KEY) ?? undefined;

const deletePersistedAccessToken = () =>
  localStorage.removeItem(ACCESS_TOKEN_KEY);

const deletePersistedCodeVerifier = () =>
  localStorage.removeItem(CODE_VERIFIER_KEY);

/**
 * Signals
 */

export const accessToken = signal<AccessToken | undefined>(
  getPersistedAccessToken(),
);

export const codeVerifier = signal<CodeVerifier | undefined>(
  getPersistedCodeVerifier(),
);

export const authorizationCode = signal<string>();

// Exchange states
export const exchangeError = signal<string>();
export const exchanging = signal(false);

// Server verification states
export const serverVerificationError = signal<string>();
export const verifyingWithServer = signal(false);

// logout states
export const logoutError = signal<string>();
export const loggingOut = signal(false);

/**
 * Computed/s
 */

export const isAuthenticated = computed(() => Boolean(accessToken.value));

export const exchangeStates = computed(() => ({
  error: exchangeError.value,
  loading: exchanging.value,
}));

export const serverVerificationStates = computed(() => ({
  error: serverVerificationError.value,
  loading: verifyingWithServer.value,
}));

export const loginStates = computed(() => ({
  error: exchangeError.value || serverVerificationError.value,
  loading: exchanging.value || verifyingWithServer.value,
}));

export const logoutStates = computed(() => ({
  error: logoutError.value,
  loading: loggingOut.value,
}));

/**
 * Setters
 */

export const setAccessToken = (newToken: AccessToken = "") => {
  accessToken.value = newToken;
};

export const setCodeVerifier = (newCodeVerifier: CodeVerifier = "") => {
  codeVerifier.value = newCodeVerifier;
};

/**
 * Actions
 */

export const redirect = async () => {
  // Flush access token
  accessToken.value = "";

  const { code_challenge, code_challenge_method, code_verifier } =
    await pkceChallenge();

  // Persist 'code_verifier' throughout the session for code exchange
  setCodeVerifier(code_verifier);

  const params = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    response_type: "code",
    scope: OAUTH_SCOPES,
    code_challenge,
    code_challenge_method,
    access_type: "offline", // Get refresh token
    prompt: "consent", // Always show consent to get refresh token
  });

  window.location.href = `${OAUTH_AUTH_URL}?${params}`;
};

export const exchangeToken = async (
  code: string,
  onSuccess: (resolved: OauthTokenResponse) => void,
) => {
  batch(() => {
    exchanging.value = true;
    exchangeError.value = "";
  });

  if (!codeVerifier.value) {
    batch(() => {
      exchangeError.value =
        "No code verifier found. Please try logging in again.";
      exchanging.value = false;
    });
    return;
  }

  const { request, resolver, errorResolver } = exchangeTokenService();

  try {
    const response = await request({
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      code,
      code_verifier: codeVerifier.value,
      grant_type: OAUTH_GRANT_TYPE,
      redirect_uri: OAUTH_REDIRECT_URI,
    });

    const resolved = resolver(response) as OauthTokenResponse;

    // Call success callback
    onSuccess(resolved);

    // Flush old 'code_verifier'
    setCodeVerifier();
  } catch (e) {
    if (isFetchError(e)) {
      const errorData = errorResolver(e.data as OauthTokenErrorResponse);
      if (errorData) {
        exchangeError.value = errorData.message;
      }
    } else {
      exchangeError.value =
        e instanceof Error ? e.message : "Failed to exchange code";
    }

    return Promise.reject(e);
  } finally {
    exchanging.value = false;
  }
};

export const verifyWithServer = async (payload: OauthTokenResponse) => {
  batch(() => {
    accessToken.value = ""; // Flush old access token
    verifyingWithServer.value = true;
    serverVerificationError.value = "";
  });

  try {
    const { request, resolver, errorResolver } = verifyOauth();

    const response = await request(payload);

    const errorData = errorResolver(response);
    if (errorData) {
      serverVerificationError.value = errorData.message;
      return Promise.reject(errorData);
    }

    const resolved = resolver(response);

    // Set new access token
    setAccessToken(resolved?.session_token);
  } catch (e) {
    serverVerificationError.value =
      e instanceof Error ? e.message : "Failed to verify with server";
    return Promise.reject(e);
  } finally {
    verifyingWithServer.value = false;
  }
};

export const logout = async (isForced = true) => {
  const onSuccess = () => {
    // Flush access token
    accessToken.value = "";
    toast.success("Logout successfully");
  };

  batch(() => {
    logoutError.value = "";
    loggingOut.value = true;
  });

  try {
    const { request, errorResolver } = logoutService();

    const response = await request();

    const errorData = errorResolver(response);
    if (errorData) {
      serverVerificationError.value = errorData.message;
      return Promise.reject(errorData);
    }

    if (!isForced) {
      onSuccess();
    }
  } catch (e) {
    logoutError.value = e instanceof Error ? e.message : "Failed to logout";
    return Promise.reject(e);
  } finally {
    batch(() => {
      // Run success effect despite api call result
      if (isForced) onSuccess();
      loggingOut.value = false;
    });
  }
};

/**
 * Subscribers
 */

accessToken.subscribe((value) => {
  if (!value) {
    deletePersistedAccessToken();
  } else {
    localStorage.setItem(ACCESS_TOKEN_KEY, value);
  }
});

codeVerifier.subscribe((value) => {
  if (!value) {
    deletePersistedCodeVerifier();
  } else {
    sessionStorage.setItem(CODE_VERIFIER_KEY, value);
  }
});

import pkceChallenge from "pkce-challenge";
import { batch, computed, signal } from "@preact/signals-core";

import type { OauthTokenResponse } from "@/api/types";

import {
  OAUTH_AUTH_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE,
  OAUTH_REDIRECT_URI,
  OAUTH_SCOPES,
} from "@/constants/oauth";

import { exchangeToken as exchangeTokenService } from "@/api/oauth-services";
import { verifyOauth } from "@/api/app-services";

type AccessToken = string;
type CodeVerifier = string;

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

export const authenticateStates = computed(() => ({
  error: exchangeError.value || serverVerificationError.value,
  loading: exchanging.value || verifyingWithServer.value,
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

  try {
    const { request, resolver, errorResolver } = exchangeTokenService();

    const response = await request({
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      code,
      code_verifier: codeVerifier.value,
      grant_type: OAUTH_GRANT_TYPE,
      redirect_uri: OAUTH_REDIRECT_URI,
    });

    const errorData = errorResolver(response);
    if (errorData) {
      exchangeError.value = errorData.message;
      return;
    }

    const resolved = resolver(response) as OauthTokenResponse;

    // Call success callback
    onSuccess(resolved);

    // Flush old 'code_verifier'
    setCodeVerifier();
  } catch (err) {
    exchangeError.value =
      err instanceof Error ? err.message : "Failed to exchange code";
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
      return;
    }

    const resolved = resolver(response);

    // Set new access token
    setAccessToken(resolved?.session_token);
  } catch (err) {
    serverVerificationError.value =
      err instanceof Error ? err.message : "Failed to verify with server";
  } finally {
    verifyingWithServer.value = false;
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

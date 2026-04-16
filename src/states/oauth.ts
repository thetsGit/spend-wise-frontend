import pkceChallenge from "pkce-challenge";
import { computed, signal } from "@preact/signals-core";

import type { OauthTokenResponse } from "@/types/oauth";

import {
  OAUTH_AUTH_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE,
  OAUTH_REDIRECT_URI,
  OAUTH_SCOPES,
} from "@/constants/oauth";

import { exchangeToken as exchangeTokenService } from "@/api/oauth-services";

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

// isAuthenticated
// redirect (method)
// code challenge, code verifier (session storage)
//
// jwt (local storage)
// isExchangingCode
//

/**
 * Signals
 */

export const accessToken = signal<AccessToken | undefined>(
  getPersistedAccessToken(),
);

export const codeVerifier = signal<CodeVerifier | undefined>(
  getPersistedCodeVerifier(),
);

export const exchangeError = signal<string>();
export const isExchanging = signal(false);

/**
 * Computed/s
 */

export const isAuthenticated = computed(() => Boolean(accessToken.value));

export const exchangeStates = computed(() => ({
  error: exchangeError,
  loading: isExchanging,
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

export const setExchangeError = (newError: string = "") => {
  exchangeError.value = newError;
};

export const setIsExchanging = (newIsExchanging: boolean) => {
  isExchanging.value = newIsExchanging;
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

export const exchangeToken = async (code: string) => {
  setIsExchanging(true);
  setExchangeError();

  if (!codeVerifier.value) {
    setExchangeError("No code verifier found. Please try logging in again.");
    setIsExchanging(false);
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
      setExchangeError(errorData.message);
    }

    const resolved = resolver(response) as OauthTokenResponse;
    // set data
    // save access token here
    // later -> call BE api for JWT

    setAccessToken(resolved.access_token);

    // Flush old 'code_verifier'
    setCodeVerifier();
  } catch (err) {
    setExchangeError(
      err instanceof Error ? err.message : "Failed to exchange code",
    );
  } finally {
    setIsExchanging(false);
  }

  // // Clean up
  // sessionStorage.removeItem(CODE_VERIFIER_KEY);

  // // Send Google tokens to our backend
  // const authResponse = await api<{ data: { token: string; user: User } }>(
  //   "/api/auth/google",
  //   {
  //     method: "POST",
  //     body: {
  //       access_token: googleTokens.access_token,
  //       refresh_token: googleTokens.refresh_token,
  //       id_token: googleTokens.id_token,
  //       expires_in: googleTokens.expires_in,
  //     },
  //   },
  // );

  // // Store our JWT
  // localStorage.setItem(ACCESS_TOKEN_KEY, authResponse.data.token);

  // setState({
  //   user: authResponse.data.user,
  //   accessToken: authResponse.data.token,
  //   isAuthenticated: true,
  //   isLoading: false,
  // });
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

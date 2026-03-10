/**
 * Wink auth constants, storage helpers, and API/URL utilities.
 * Used by WinkAuthProvider.
 */

import type { AuthError, WinkUserProfile, WinkSessionResponse } from "@/types/wink";

export const AUTH_STATES = {
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  LOGGING_IN: "logging_in",
  LOGGING_OUT: "logging_out",
  LOADING_PROFILE: "loading_profile",
  ERROR: "error",
} as const;

export const MANUAL_LOGOUT_KEY = "wink_manual_logout";

export const clearBrowserSessionArtifacts = (): void => {
  if (typeof window === "undefined") return;

  document.cookie.split(";").forEach((cookie) => {
    const separatorIndex = cookie.indexOf("=");
    const name = separatorIndex > -1 ? cookie.substring(0, separatorIndex) : cookie;
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });

  const storageKeysToClear = Object.keys(window.localStorage).filter(
    (key) =>
      key.includes("kc-callback") ||
      key.includes("wink") ||
      key.includes("token") ||
      key.includes("session")
  );

  storageKeysToClear.forEach((key) => {
    window.localStorage.removeItem(key);
  });

  window.sessionStorage.removeItem("wink_post_auth_next");
};

export const markManualLogout = (): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(MANUAL_LOGOUT_KEY, "1");
};

export const clearManualLogout = (): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
};

export const hasManualLogoutMarker = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "1";
};

export const toAuthError = (step: string, error: unknown, fallbackMessage: string): AuthError => ({
  step,
  message: error instanceof Error ? error.message : fallbackMessage,
  details: error,
});

/**
 * Fetches user profile from internal API route.
 */
export const fetchUserFromBackend = async (
  backendUrl: string,
  clientId: string,
  token: string
): Promise<WinkUserProfile> => {
  const base = backendUrl.replace(/\/$/, "");
  const params = new URLSearchParams({ clientId, token });
  const res = await fetch(`${base}/user?${params.toString()}`);
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Backend user request failed: ${res.status}`);
  }
  return res.json() as Promise<WinkUserProfile>;
};

/**
 * Fetches session from internal API route.
 */
export const fetchSessionFromBackend = async (
  backendUrl: string,
  returnUrl: string,
  cancelUrl: string
): Promise<WinkSessionResponse> => {
  const base = backendUrl.replace(/\/$/, "");
  const params = new URLSearchParams({ returnUrl, cancelUrl });
  const res = await fetch(`${base}/session?${params.toString()}`);
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Backend session request failed: ${res.status}`);
  }
  return res.json() as Promise<WinkSessionResponse>;
};

interface OidcLogoutParams {
  authUrl: string;
  realm: string;
  clientId: string;
  idToken?: string;
  redirectUri: string;
}

export const buildOidcLogoutUrl = ({
  authUrl,
  realm,
  clientId,
  idToken,
  redirectUri,
}: OidcLogoutParams): string | null => {
  if (!authUrl || !realm || !clientId || !redirectUri) return null;

  const normalizedAuthUrl = authUrl.endsWith("/") ? authUrl.slice(0, -1) : authUrl;
  const base = `${normalizedAuthUrl}/realms/${encodeURIComponent(realm)}/protocol/openid-connect/logout`;
  const params = new URLSearchParams({
    post_logout_redirect_uri: redirectUri,
    client_id: clientId,
  });
  if (idToken) params.set("id_token_hint", idToken);
  return `${base}?${params.toString()}`;
};

/** Config shape for getWinkLoginClient. SDK may require sessionId in type; we pass it only when starting login. */
export interface WinkConfigShape {
  clientId: string;
  realm: string;
  loggingEnabled: boolean;
  cancelUrl: string;
  onAuthErrorFailure: (error: unknown) => void;
  override: boolean;
  overrideValues: { BASE_URL?: string; AUTH_URL?: string };
  sessionId?: string;
}

/**
 * Builds the config object for getWinkLoginClient.
 * No secret - session is created via internal API route.
 */
export const getWinkConfig = (sessionId?: string): WinkConfigShape => {
  const clientId = process.env.NEXT_PUBLIC_WINK_CLIENT_ID ?? "";
  const realm = process.env.NEXT_PUBLIC_WINK_REALM ?? "";
  const winkBaseUrl = process.env.NEXT_PUBLIC_WINK_BASE_URL;
  const winkAuthUrl = process.env.NEXT_PUBLIC_WINK_AUTH_URL;

  const config: WinkConfigShape = {
    clientId,
    realm,
    loggingEnabled: true,
    cancelUrl: typeof window !== "undefined" ? `${window.location.origin}/callback` : "/callback",
    onAuthErrorFailure: (error: unknown) => console.error("Wink auth error:", error),
    override: true,
    overrideValues: {
      ...(winkBaseUrl && { BASE_URL: winkBaseUrl }),
      ...(winkAuthUrl && { AUTH_URL: winkAuthUrl }),
    },
  };
  if (sessionId) config.sessionId = sessionId;
  return config;
};

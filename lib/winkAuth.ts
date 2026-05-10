/**
 * Wink auth constants, API utilities, and config builder.
 * Used by WinkAuthProvider.
 */

import { WinkError } from "wink-identity-sdk";
import type { AuthError, WinkUserProfile, WinkSessionResponse } from "@/types/wink";

export const AUTH_STATES = {
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  LOGGING_IN: "logging_in",
  LOGGING_OUT: "logging_out",
  LOADING_PROFILE: "loading_profile",
  ERROR: "error",
} as const;

export const toAuthError = (step: string, error: unknown, fallbackMessage: string): AuthError => {
  if (error instanceof WinkError) {
    return {
      step,
      message: error.message,
      oidcCode: error.oidcCode,
      oidcDescription: error.oidcDescription,
      details: error,
    };
  }
  return {
    step,
    message: error instanceof Error ? error.message : fallbackMessage,
    details: error,
  };
};

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
 * Fetches a Wink session from the internal API route.
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

/** Config shape for getWinkLoginClient. */
export interface WinkConfigShape {
  clientId: string;
  realm: string;
  loggingEnabled: boolean;
  cancelUrl: string;
  onAuthErrorFailure: (error: unknown) => void;
  override: boolean;
  overrideValues: { BASE_URL?: string; AUTH_URL?: string };
}

/**
 * Builds the base config object for getWinkLoginClient.
 * sessionId is intentionally excluded — pass it to winkLogin({ sessionId }) at login time.
 */
export const getWinkConfig = (): WinkConfigShape => ({
  clientId: process.env.NEXT_PUBLIC_WINK_CLIENT_ID ?? "",
  realm: process.env.NEXT_PUBLIC_WINK_REALM ?? "",
  loggingEnabled: true,
  cancelUrl: typeof window !== "undefined" ? `${window.location.origin}/callback` : "/callback",
  onAuthErrorFailure: (error: unknown) => console.error("Wink auth error:", error),
  override: true,
  overrideValues: {
    ...(process.env.NEXT_PUBLIC_WINK_BASE_URL && { BASE_URL: process.env.NEXT_PUBLIC_WINK_BASE_URL }),
    ...(process.env.NEXT_PUBLIC_WINK_AUTH_URL && { AUTH_URL: process.env.NEXT_PUBLIC_WINK_AUTH_URL }),
  },
});

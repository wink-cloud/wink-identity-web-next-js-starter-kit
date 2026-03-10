export type AuthState =
  | "authenticated"
  | "unauthenticated"
  | "logging_in"
  | "logging_out"
  | "loading_profile"
  | "error";

export interface AuthError {
  step: string;
  message: string;
  details?: unknown;
}

/** User profile from backend GET /user (verify-client). */
export interface WinkUserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNo?: string;
  winkTag?: string;
  winkToken?: string;
  expiryTime?: string;
  dateOfBirth?: string | null;
  clientSecret?: string | null;
}

/** Session payload from backend GET /session. */
export interface WinkSessionResponse {
  sessionId?: string;
  SessionId?: string;
  id?: string;
  session_id?: string;
}

export interface WinkAuthContextValue {
  winkClient: unknown;
  userProfile: WinkUserProfile | null;
  isAuthenticated: boolean;
  authState: AuthState;
  authError: AuthError | null;
  isProfileLoading: boolean;
  refreshUserProfile: () => void;
  login: () => void;
  logout: () => void;
}

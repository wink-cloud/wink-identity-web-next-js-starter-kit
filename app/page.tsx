"use client";

import Image from "next/image";
import { useWinkAuth } from "@/components/WinkAuthProvider";

export default function Home() {
  const {
    winkClient,
    userProfile,
    isAuthenticated,
    authState,
    isProfileLoading,
    authError,
    refreshUserProfile,
    login,
    logout,
  } = useWinkAuth();

  const isBusy = authState === "logging_in" || authState === "logging_out";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-[520px] rounded-xl border border-gray-200 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-semibold text-gray-900">
          Wink Identity Verification
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Use this starter to complete an end-to-end Wink login flow.
        </p>
        <p className="mt-4 text-sm text-gray-700">
          <strong>Status:</strong> {authState}
        </p>

        {!isAuthenticated ? (
          <div className="mt-4 flex justify-center">
            <button
              id="loginBtn"
              onClick={login}
              disabled={!winkClient || isBusy}
              className="wink-oauth-button-light"
              aria-label="Login with Wink"
            >
              <Image
                src="https://cdn.jsdelivr.net/gh/wink-cloud/wink-integration@main/semicolon-red.svg"
                alt="Wink"
                width={28}
                height={28}
              />
              Login with Wink
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              id="logoutBtn"
              onClick={logout}
              disabled={isBusy}
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-white hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Logout
            </button>
            <button
              id="refreshProfileBtn"
              onClick={refreshUserProfile}
              disabled={isBusy}
              className="rounded-lg border border-gray-300 bg-[#374151] px-4 py-2 text-white hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh Profile
            </button>
          </div>
        )}

        {isProfileLoading ? (
          <p className="mt-4 text-sm text-gray-700">Loading user profile...</p>
        ) : null}

        {authError ? (
          <p className="mt-4 text-sm text-[#b91c1c]" role="alert">
            [{authError.step}] {authError.message}
          </p>
        ) : null}

        {isAuthenticated ? (
          <div
            id="userProfileCard"
            className="mt-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4"
          >
            <h3 className="mb-3 font-semibold text-gray-900">
              Authenticated User Profile
            </h3>
            {!userProfile ? (
              <p className="text-sm text-gray-700">
                User profile is not available yet. Click Refresh Profile.
              </p>
            ) : (
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">First Name</dt>
                  <dd className="text-gray-900">
                    {userProfile.firstName ?? "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Last Name</dt>
                  <dd className="text-gray-900">
                    {userProfile.lastName ?? "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Email</dt>
                  <dd className="text-gray-900">
                    {userProfile.email ?? "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Contact Number</dt>
                  <dd className="text-gray-900">
                    {userProfile.contactNo ?? "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Wink Tag</dt>
                  <dd className="text-gray-900">
                    {userProfile.winkTag ?? "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Wink Token</dt>
                  <dd className="font-mono text-xs text-gray-900">
                    {userProfile.winkToken ?? "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Profile Expiry Time</dt>
                  <dd className="text-gray-900">
                    {userProfile.expiryTime ?? "N/A"}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

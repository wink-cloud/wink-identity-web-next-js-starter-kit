"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getWinkLoginClient } from "wink-identity-sdk";

type WinkLogin = ReturnType<typeof getWinkLoginClient>;

type WinkAuthContext = {
  winkClient: WinkLogin | null;
  login: () => void;
  logout: () => void;
};

const WinkAuthContext = createContext<WinkAuthContext | null>(null);

export function WinkAuthProvider({ children }: { children: React.ReactNode }) {
  const [winkClient, setWinkClient] = useState<null | WinkLogin>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const config = {
      clientId: `${process.env.NEXT_PUBLIC_WINK_CLIENT_ID}`,
      realm: `${process.env.NEXT_PUBLIC_WINK_REALM}`,
      secret: `${process.env.NEXT_PUBLIC_WINK_SECRET}`,
      loggingEnabled: true,
      cancelUrl: "http://localhost:3000/callback", // Path of callback URL
      onAuthErrorFailure: (error: unknown) => console.error(error),
      override: true,
      overrideValues: {
        BASE_URL: process.env.NEXT_PUBLIC_WINK_BASE_URL,
        AUTH_URL: process.env.NEXT_PUBLIC_WINK_AUTH_URL,
      },
    };

    const client = getWinkLoginClient(config);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWinkClient(client);
    client.winkInit({
      silentCheckSsoRedirectUri: "http://localhost:3000/silent-check-sso.html", // silent login check html
      onFailure(error) {
        console.error(error);
      },
      async onSuccess() {
        const user = await client.getUser();
        console.log("user", user);
      },
    });
  }, []);

  // ---- Login ----
  const login = () => {
    if (!winkClient) return;
    winkClient.winkLogin({
      onFailure(error) {
        console.error(error);
      },
    });
  };

  // ---- Logout ----
  const logout = () => {
    if (!winkClient) return;
    winkClient.winkLogout({
      onFailure(error) {
        console.error(error);
      },
    });
  };

  const value = {
    winkClient,
    login,
    logout,
  };

  return (
    <WinkAuthContext.Provider value={value}>
      {children}
    </WinkAuthContext.Provider>
  );
}

export function useWinkAuth() {
  const context = useContext(WinkAuthContext);
  if (!context) {
    throw new Error("useWinkAuth must be used within WinkAuthProvider");
  }
  return context;
}

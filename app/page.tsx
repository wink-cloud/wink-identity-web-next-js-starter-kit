"use client";

import { useWinkAuth } from "@/components/WinkAuthProvider";

export default function Home() {
  const { winkClient, login, logout } = useWinkAuth();
  const authenticated = winkClient?.authenticated;

  const onLoginClick = () => {
    login();
  };

  const onLogOutClick = () => {
    logout();
  };

  return (
    <div>
      {authenticated ? (
        <button onClick={onLogOutClick}>Log Out</button>
      ) : (
        <button onClick={onLoginClick}>Login</button>
      )}
    </div>
  );
}

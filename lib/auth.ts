"use client";
import { useEffect, useState } from "react";

// Auth state is intentionally deferred.
//
// Samagama.in is the planned identity provider, but the OAuth client
// credentials and JS SDK are not yet wired. Until they are, the platform
// runs fully without authentication: progress is saved to localStorage,
// no login is required, and no fake/demo user is created.
//
// To enable real auth:
//   1. Set NEXT_PUBLIC_SAMAGAMA_AUTH_URL, NEXT_PUBLIC_SAMAGAMA_CLIENT_ID,
//      NEXT_PUBLIC_SAMAGAMA_REDIRECT_URI, and SAMAGAMA_CLIENT_SECRET in
//      .env (see .env.example).
//   2. Implement the OAuth round-trip in `login()` below (popup,
//      callback, token exchange, profile fetch).
//   3. Set AUTH_ENABLED to true.
//
// Until then, useAuth() returns { status: "disabled", user: null } and
// the UI shows an honest "Sign in is paused — your progress saves locally".

export type AuthStatus = "loading" | "disabled";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

const AUTH_ENABLED = false;

export function useAuth(): AuthState & {
  login: () => Promise<void>;
  logout: () => void;
} {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  useEffect(() => {
    if (!AUTH_ENABLED) {
      setState({ status: "disabled", user: null });
    }
  }, []);

  const login = async () => {
    // Disabled. Wire the real samagama.in OAuth flow when credentials land.
    throw new Error(
      "Sign-in is paused — see lib/auth.ts to enable when samagama.in credentials are configured.",
    );
  };

  const logout = () => {
    // no-op while auth is disabled
  };

  return { ...state, login, logout };
}
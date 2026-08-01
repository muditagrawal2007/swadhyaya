"use client";
import { useEffect, useState } from "react";

// Samagama.in auth integration scaffold.
// The full OAuth round-trip (popup, callback, token exchange, profile fetch) is
// stubbed here. Drop the real implementation into the TODO blocks once you have
// the auth provider's JS SDK and client id.
//
// Auth state is mirrored into a localStorage key so the rest of the app can
// read it synchronously without prop-drilling.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const AUTH_KEY = "swadhyaya-auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  const login = async () => {
    // TODO: replace with real samagama.in OAuth flow.
    // Typical flow:
    //   1. Open samagama.in /authorize?client_id=...&redirect_uri=...
    //   2. User signs in, samagama.in redirects to /auth/callback?code=...
    //   3. Server exchanges code for access_token + id_token
    //   4. Decode id_token, fetch user profile, persist to localStorage
    //
    // For now, a placeholder is created so the UI can be developed end-to-end.
    const placeholder: AuthUser = {
      id: "demo",
      name: "Demo Student",
      email: "demo@samagama.in",
      avatarUrl: undefined,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(placeholder));
    setUser(placeholder);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, loading, login, logout };
}

"use client";
import { useAuth } from "@/lib/auth";
import { LogIn, LogOut, User } from "lucide-react";

export function AuthButton() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div className="text-xs text-faint">...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-elev/40">
          <User size={12} className="text-dim" />
          <span className="text-dim text-xs">{user.name}</span>
        </div>
        <button
          onClick={logout}
          className="text-xs text-dim hover:text-ink flex items-center gap-1"
          title="Sign out"
        >
          <LogOut size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-line text-ink hover:bg-elev transition"
    >
      <LogIn size={14} />
      <span className="hidden sm:inline">Sign in</span>
    </button>
  );
}

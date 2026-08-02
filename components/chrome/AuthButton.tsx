"use client";
import { useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";

// AuthButton: shows the current auth state honestly.
// While auth is disabled (no samagama.in credentials yet), the button is
// a muted indicator — not an actionable "Sign in" that does nothing.
export function AuthButton() {
  const { status } = useAuth();
  const [hovered, setHovered] = useState(false);

  if (status === "loading") {
    return <div className="text-xs text-faint">…</div>;
  }

  // status === "disabled"
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        disabled
        aria-label="Sign-in is paused"
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-line/50 text-faint cursor-not-allowed"
      >
        <Lock size={12} />
        <span className="hidden sm:inline">Sign in paused</span>
      </button>
      {hovered && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50 bg-elev border border-line rounded-md p-3 shadow-card text-xs text-dim leading-relaxed">
          <div className="font-medium text-ink mb-1">Sign-in is paused</div>
          Your progress saves locally — no account needed to use Swadhyaya.
          When samagama.in credentials land, the OAuth flow will be wired here.
        </div>
      )}
    </div>
  );
}
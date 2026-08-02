"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for now. Wire a real reporter (Sentry, etc.) when needed.
    console.error("Swadhyaya runtime error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warn/10 border border-warn/30 text-warn mb-6">
        <AlertTriangle size={20} />
      </div>
      <div className="text-[10px] text-faint uppercase tracking-wider mb-3">
        Something broke
      </div>
      <h1 className="font-serif text-4xl text-ink mb-3">
        The playground tripped on something.
      </h1>
      <p className="text-dim leading-relaxed mb-8">
        A runtime error happened while rendering this view. Your progress is
        safe — it's saved locally in your browser.
      </p>
      {error.digest && (
        <div className="mb-6 text-xs font-mono text-faint">
          digest: {error.digest}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-canvas font-medium hover:bg-accent/90 transition"
        >
          <RotateCw size={14} />
          <span>Try again</span>
        </button>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-line text-ink hover:bg-elev transition"
        >
          <ArrowLeft size={14} />
          <span>Course map</span>
        </Link>
      </div>
    </div>
  );
}
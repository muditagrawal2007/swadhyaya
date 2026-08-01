"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Swords, Trophy, BookOpen } from "lucide-react";
import { PHASES } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";

export function SideRail() {
  const pathname = usePathname();
  const completed = useProgress((s) => s.completed);

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-line min-h-[calc(100vh-56px)] sticky top-14 h-[calc(100vh-56px)]">
      <div className="p-4 border-b border-line">
        <Link
          href="/learn"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition",
            pathname === "/learn"
              ? "bg-elev text-ink"
              : "text-dim hover:text-ink hover:bg-elev/50",
          )}
        >
          <Map size={16} />
          <span>Course Map</span>
        </Link>
        <Link
          href="/play"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition",
            pathname === "/play"
              ? "bg-elev text-ink"
              : "text-dim hover:text-ink hover:bg-elev/50",
          )}
        >
          <Swords size={16} />
          <span>Daily Battle</span>
        </Link>
        <Link
          href="/leaderboard"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition",
            pathname === "/leaderboard"
              ? "bg-elev text-ink"
              : "text-dim hover:text-ink hover:bg-elev/50",
          )}
        >
          <Trophy size={16} />
          <span>Leaderboard</span>
        </Link>
        <Link
          href="/about"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition",
            pathname === "/about"
              ? "bg-elev text-ink"
              : "text-dim hover:text-ink hover:bg-elev/50",
          )}
        >
          <BookOpen size={16} />
          <span>Credits</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[10px] text-faint uppercase tracking-wider px-3 py-2">
          Phases
        </div>
        {PHASES.map((p) => {
          const phaseCount = getPhaseCount(p.id);
          const phaseDone = getPhaseDone(p.id, completed);
          const pct = phaseCount === 0 ? 0 : (phaseDone / phaseCount) * 100;
          return (
            <div
              key={p.id}
              className="px-3 py-2 rounded-md hover:bg-elev/40 transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1 h-4 rounded-sm"
                    style={{ background: p.color }}
                  />
                  <span className="text-xs text-dim group-hover:text-ink">
                    Phase {p.id}
                  </span>
                </div>
                <span className="text-[10px] text-faint font-mono">
                  {phaseDone}/{phaseCount}
                </span>
              </div>
              <div className="text-[11px] text-ink/80 leading-tight mb-1.5">
                {p.title}
              </div>
              <div className="w-full h-0.5 bg-elev rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{ width: `${pct}%`, background: p.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function getPhaseCount(phase: number) {
  // Phase 6 has 5 concepts (S1-S5). Total: 8+8+8+8+6+5 = 43.
  return [8, 8, 8, 8, 6, 5][phase - 1];
}
function getPhaseDone(phase: number, completed: string[]) {
  const prefix = ["L", "V", "T", "F", "E", "S"][phase - 1];
  return completed.filter((c) => c.startsWith(prefix)).length;
}

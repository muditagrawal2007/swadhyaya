"use client";
import { useProgress, levelFromXP, xpForLevel, xpForNextLevel } from "@/lib/progress";
import { Trophy, Medal, Award, Target, Flame, Zap } from "lucide-react";
import { useMemo } from "react";
import { CONCEPT_BY_ID, PHASES, type ConceptId } from "@/lib/curriculum";

export default function LeaderboardPage() {
  const completed = useProgress((s) => s.completed);
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const totalConcepts = Object.keys(CONCEPT_BY_ID).length;

  const phaseProgress = useMemo(() => {
    return PHASES.map((p) => {
      const phaseIds: ConceptId[] = Object.keys(CONCEPT_BY_ID)
        .filter((id) => id.startsWith(["L", "V", "T", "F", "E", "S"][p.id - 1])) as ConceptId[];
      const done = phaseIds.filter((id) => completed.includes(id)).length;
      return { ...p, total: phaseIds.length, done };
    });
  }, [completed]);

  const recentUnlocks = useMemo(() => {
    return completed.slice(-10).reverse();
  }, [completed]);

  const level = levelFromXP(xp);
  const lvlStart = xpForLevel(level);
  const lvlEnd = xpForNextLevel(level);
  const lvlPct = lvlEnd === 99999 ? 100 : ((xp - lvlStart) / (lvlEnd - lvlStart)) * 100;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <header className="mb-6">
        <div className="text-[10px] text-faint uppercase tracking-wider flex items-center gap-1">
          <Trophy size={10} className="text-accent" />
          Your Progress
        </div>
        <h1 className="font-serif text-3xl text-ink mt-1">Leaderboard</h1>
        <p className="text-sm text-dim mt-1">
          Track concepts unlocked, XP earned, and your current level.
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 text-[10px] text-faint uppercase tracking-wider">
            <Target size={11} /> Concepts
          </div>
          <div className="mt-1 text-2xl font-mono text-ink">
            {completed.length}<span className="text-faint text-sm"> / {totalConcepts}</span>
          </div>
        </div>
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 text-[10px] text-faint uppercase tracking-wider">
            <Zap size={11} /> XP
          </div>
          <div className="mt-1 text-2xl font-mono text-accent">{xp}</div>
        </div>
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 text-[10px] text-faint uppercase tracking-wider">
            <Flame size={11} /> Streak
          </div>
          <div className="mt-1 text-2xl font-mono text-warn">{streak}</div>
        </div>
      </div>

      {/* Level progress */}
      <div className="bg-card border border-line rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] text-faint uppercase tracking-wider">Current Level</div>
            <div className="text-2xl font-mono text-ink">Level {level}</div>
          </div>
          <div className="text-right text-xs text-dim">
            {xp - lvlStart} / {lvlEnd - lvlStart} XP to next
          </div>
        </div>
        <div className="w-full h-2 bg-elev rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${lvlPct}%` }}
          />
        </div>
      </div>

      {/* Phase progress */}
      <div className="bg-card border border-line rounded-xl p-4 mb-6">
        <div className="text-[10px] text-faint uppercase tracking-wider mb-3">Phases</div>
        <div className="space-y-2.5">
          {phaseProgress.map((p) => {
            const pct = p.total === 0 ? 0 : (p.done / p.total) * 100;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <span
                  className="w-1 h-5 rounded-sm shrink-0"
                  style={{ background: p.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink truncate">{p.title}</span>
                    <span className="text-faint font-mono shrink-0 ml-2">
                      {p.done}/{p.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-elev rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${pct}%`, background: p.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent unlocks */}
      <div className="bg-card border border-line rounded-xl p-4">
        <div className="text-[10px] text-faint uppercase tracking-wider mb-3">
          Recent unlocks
        </div>
        {recentUnlocks.length === 0 ? (
          <div className="text-center py-8">
            <Award size={28} className="mx-auto text-faint" />
            <p className="mt-3 text-sm text-dim">
              No concepts unlocked yet. Start with L1 on the course map.
            </p>
          </div>
        ) : (
          <ol className="space-y-1.5">
            {recentUnlocks.map((id, i) => {
              const c = CONCEPT_BY_ID[id];
              if (!c) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-elev/40 transition"
                >
                  {i === 0 ? (
                    <Medal size={14} className="text-accent shrink-0" />
                  ) : (
                    <span className="w-3.5 text-center text-[10px] text-faint font-mono">
                      #{i + 1}
                    </span>
                  )}
                  <span className="text-[10px] text-faint font-mono w-6">{id}</span>
                  <span className="text-sm text-ink flex-1 truncate">{c.title}</span>
                  <span className="text-[10px] text-accent font-mono">+{c.xp} XP</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

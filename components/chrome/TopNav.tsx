"use client";
import Link from "next/link";
import { Flame, Trophy, Layers, Menu } from "lucide-react";
import { useProgress, levelFromXP, xpForLevel, xpForNextLevel } from "@/lib/progress";
import { useState } from "react";

export function TopNav() {
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const completed = useProgress((s) => s.completed);
  const level = levelFromXP(xp);
  const lvlStart = xpForLevel(level);
  const lvlEnd = xpForNextLevel(level);
  const pct = lvlEnd === 99999 ? 100 : ((xp - lvlStart) / (lvlEnd - lvlStart)) * 100;

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
            <span className="font-serif text-lg tracking-tight text-ink group-hover:text-accent transition">
              Swadhyaya
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs text-faint ml-2">
            learn by playing
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-2 text-sm text-dim">
            <Layers size={14} />
            <span className="font-mono">{completed.length}</span>
            <span className="text-faint">/ {totalConcepts()}</span>
          </div>

          <div className="hidden md:flex flex-col items-end min-w-[120px]">
            <div className="text-[10px] text-faint uppercase tracking-wider">
              Lvl {level}
            </div>
            <div className="w-24 h-1 bg-elev rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm">
            <Flame size={14} className="text-warn" />
            <span className="font-mono text-ink">{streak}</span>
          </div>

          <Link
            href="/play"
            className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition border border-accent/20"
          >
            <Trophy size={14} />
            <span>Battle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function totalConcepts() {
  return 47; // 47 concepts total in current scope
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-accent">
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 11 L19 11 M11 3 L11 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="3" cy="11" r="1.5" fill="currentColor" />
      <circle cx="19" cy="11" r="1.5" fill="currentColor" />
      <circle cx="11" cy="3" r="1.5" fill="currentColor" />
      <circle cx="11" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

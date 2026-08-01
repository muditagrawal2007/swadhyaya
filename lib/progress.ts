"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ConceptId } from "./curriculum";
import { CONCEPTS, getUnlocked } from "./curriculum";

interface ProgressState {
  completed: ConceptId[];
  xp: number;
  streak: number;
  lastVisit: string; // ISO date
  lensModes: string[];
  battleHistory: Array<{ date: string; score: number; rank: string }>;
  // actions
  complete: (id: ConceptId, xp: number) => void;
  recordBattle: (score: number, rank: string) => void;
  unlockLens: (lens: string) => void;
  reset: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const computeStreak = (last: string, current: number): number => {
  if (!last) return 1;
  const lastDate = new Date(last);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return Math.max(1, current);
  if (diffDays === 1) return current + 1;
  return 1; // broken
};

const LEVELS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 9000, 13000];

export const levelFromXP = (xp: number): number => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i]) return i + 1;
  }
  return 1;
};

export const xpForLevel = (level: number): number => LEVELS[level - 1] ?? 0;
export const xpForNextLevel = (level: number): number => LEVELS[level] ?? 99999;

export const lensUnlockedAt = (level: number): string[] => {
  if (level >= 5) return ["eigen-overlay"];
  if (level >= 10) return ["eigen-overlay", "singular-bars"];
  if (level >= 15) return ["eigen-overlay", "singular-bars", "column-tint"];
  if (level >= 20) return ["eigen-overlay", "singular-bars", "column-tint", "auto-3d"];
  return [];
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: [],
      xp: 0,
      streak: 1,
      lastVisit: today(),
      lensModes: [],
      battleHistory: [],
      complete: (id, xp) => {
        const completed = get().completed.includes(id)
          ? get().completed
          : [...get().completed, id];
        const newXP = get().xp + xp;
        const newStreak = computeStreak(get().lastVisit, get().streak);
        const lvl = levelFromXP(newXP);
        set({
          completed,
          xp: newXP,
          streak: newStreak,
          lastVisit: today(),
          lensModes: lensUnlockedAt(lvl),
        });
      },
      recordBattle: (score, rank) => {
        set({
          battleHistory: [
            ...get().battleHistory,
            { date: today(), score, rank },
          ].slice(-50),
        });
      },
      unlockLens: (lens) => {
        if (!get().lensModes.includes(lens)) {
          set({ lensModes: [...get().lensModes, lens] });
        }
      },
      reset: () =>
        set({
          completed: [],
          xp: 0,
          streak: 1,
          lastVisit: today(),
          lensModes: [],
          battleHistory: [],
        }),
    }),
    {
      name: "swadhyaya-progress",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useUnlocked = () => {
  const completed = useProgress((s) => s.completed);
  return getUnlocked(new Set(completed));
};

export const useIsUnlocked = (id: ConceptId) => {
  const completed = useProgress((s) => s.completed);
  return getUnlocked(new Set(completed)).has(id);
};

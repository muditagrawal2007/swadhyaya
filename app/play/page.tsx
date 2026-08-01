"use client";
import { useState, useMemo } from "react";
import { QUESTIONS, type Question } from "@/lib/questions";
import { useProgress } from "@/lib/progress";
import { CONCEPT_BY_ID, PHASES } from "@/lib/curriculum";
import { Swords, Check, X, Timer, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

const SECONDS_PER_Q = 25;

// Deterministic seed from today's date
function todaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pickDailyQuestions(unlocked: string[]): Question[] {
  const seed = todaySeed();
  const rng = seededRandom(seed);
  const eligible = QUESTIONS.filter((q) => unlocked.includes(q.conceptId));
  if (eligible.length === 0) return QUESTIONS.slice(0, 5);
  // Group by phase, pick 1 per phase
  const byPhase: Record<number, Question[]> = {};
  for (const q of eligible) {
    const c = CONCEPT_BY_ID[q.conceptId];
    if (!c) continue;
    if (!byPhase[c.phase]) byPhase[c.phase] = [];
    byPhase[c.phase].push(q);
  }
  const picked: Question[] = [];
  for (const phase of [1, 2, 3, 4, 5, 6]) {
    const arr = byPhase[phase];
    if (!arr || arr.length === 0) continue;
    picked.push(arr[Math.floor(rng() * arr.length)]);
    if (picked.length >= 5) break;
  }
  // If not 5, pad from any eligible
  while (picked.length < 5 && eligible.length > 0) {
    const i = Math.floor(rng() * eligible.length);
    if (!picked.includes(eligible[i])) picked.push(eligible[i]);
  }
  return picked;
}

export default function BattlePage() {
  const completed = useProgress((s) => s.completed);
  const battleHistory = useProgress((s) => s.battleHistory);
  const recordBattle = useProgress((s) => s.recordBattle);

  const questions = useMemo(() => pickDailyQuestions(completed), [completed]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(Date.now());

  // Timer
  useMemo(() => {
    if (done) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // auto-advance
          setIdx((i) => Math.min(i + 1, questions.length - 1));
          return SECONDS_PER_Q;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [done, questions.length]);

  // Re-init timer on question change
  useMemo(() => {
    setTimeLeft(SECONDS_PER_Q);
  }, [idx]);

  const q = questions[idx];
  if (!q) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Swords size={32} className="mx-auto text-faint" />
        <h1 className="mt-4 font-serif text-2xl text-ink">No unlocked concepts yet</h1>
        <p className="text-sm text-dim mt-2">
          Complete at least one concept to enter the daily battle.
        </p>
      </div>
    );
  }

  const score = useMemo(() => {
    let s = 0;
    for (const qq of questions) {
      const a = answers[qq.id];
      if (a && qq.options.find((o) => o.id === a)?.correct) {
        s += 100;
      }
    }
    // Time bonus
    const elapsed = Math.min(120, (Date.now() - startedAt) / 1000);
    s += Math.max(0, Math.floor(50 * (1 - elapsed / 120)));
    return s;
  }, [answers, questions, startedAt]);

  const allAnswered = questions.every((qq) => answers[qq.id]);

  if (done || (allAnswered && idx === questions.length - 1 && answers[q.id])) {
    if (!done) {
      // Auto-finish
      const rank =
        score >= 400 ? "Sensei" :
        score >= 300 ? "Master" :
        score >= 200 ? "Adept" :
        score >= 100 ? "Apprentice" :
        "Novice";
      recordBattle(score, rank);
    }
    const correct = questions.filter((qq) => answers[qq.id] && qq.options.find((o) => o.id === answers[qq.id])?.correct).length;
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-card border border-accent/30 rounded-xl p-8 text-center">
          <Trophy size={36} className="mx-auto text-accent" />
          <h1 className="mt-4 font-serif text-3xl text-ink">Battle complete</h1>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-elev/40 rounded-lg p-3">
              <div className="text-2xl font-mono text-accent">{score}</div>
              <div className="text-[10px] text-faint uppercase tracking-wider mt-1">Score</div>
            </div>
            <div className="bg-elev/40 rounded-lg p-3">
              <div className="text-2xl font-mono text-ink">{correct}/{questions.length}</div>
              <div className="text-[10px] text-faint uppercase tracking-wider mt-1">Correct</div>
            </div>
            <div className="bg-elev/40 rounded-lg p-3">
              <div className="text-2xl font-mono text-warn">—</div>
              <div className="text-[10px] text-faint uppercase tracking-wider mt-1">Rank</div>
            </div>
          </div>
          <div className="mt-6 text-sm text-dim">
            Same five questions for everyone today. Come back tomorrow.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[10px] text-faint uppercase tracking-wider flex items-center gap-1">
            <Swords size={10} className="text-warn" />
            Daily Battle
          </div>
          <h1 className="font-serif text-2xl text-ink mt-1">Five questions · One shot</h1>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono text-ink">{score}</div>
          <div className="text-[10px] text-faint uppercase tracking-wider">Score</div>
        </div>
      </header>

      <div className="mb-4 flex items-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition",
              i < idx ? "bg-accent" :
              i === idx ? "bg-accent/60" :
              "bg-elev",
            )}
          />
        ))}
      </div>

      <div className="bg-card border border-line rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-faint uppercase tracking-wider">
            Question {idx + 1} of {questions.length}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Timer size={12} className={timeLeft < 8 ? "text-warn" : "text-faint"} />
            <span className={cn("font-mono", timeLeft < 8 ? "text-warn" : "text-ink")}>{timeLeft}s</span>
          </div>
        </div>
        <div className="text-[10px] text-faint mb-2">
          From <span className="text-ink">{CONCEPT_BY_ID[q.conceptId]?.title}</span>
        </div>
        <h3 className="font-serif text-xl text-ink mb-5">{q.prompt}</h3>
        <div className="space-y-2">
          {q.options.map((o) => {
            const selected = answers[q.id] === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition",
                  selected
                    ? "border-accent bg-accent/10 text-ink"
                    : "border-line bg-elev/30 hover:bg-elev/60 text-ink",
                )}
              >
                <span className="font-mono text-xs text-faint mr-2">{o.id.toUpperCase()}</span>
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            className="text-xs text-dim hover:text-ink disabled:opacity-30"
          >
            ← Previous
          </button>
          {idx === questions.length - 1 ? (
            <button
              onClick={() => setDone(true)}
              disabled={!allAnswered}
              className="px-5 py-2 rounded bg-accent text-canvas font-medium disabled:opacity-30"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={() => setIdx(idx + 1)}
              className="px-5 py-2 rounded border border-line hover:bg-elev transition"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

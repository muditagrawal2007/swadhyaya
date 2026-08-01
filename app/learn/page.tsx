"use client";
import Link from "next/link";
import { Lock, Check, Circle, ArrowRight } from "lucide-react";
import { CONCEPTS, PHASES, type ConceptId } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";

export default function LearnMap() {
  const completed = useProgress((s) => s.completed);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">The full chain</h1>
        <p className="mt-1 text-sm text-dim max-w-2xl">
          {CONCEPTS.length} concepts across {PHASES.length} phases. Lock in the
          intuition of one to unlock the next. No skipping. No broken chains.
        </p>
      </header>

      <div className="space-y-10">
        {PHASES.map((phase) => {
          const phaseConcepts = CONCEPTS.filter((c) => c.phase === phase.id);
          return (
            <section key={phase.id}>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-6 rounded-sm"
                      style={{ background: phase.color }}
                    />
                    <span className="text-xs text-dim uppercase tracking-wider">
                      Phase {phase.id}
                    </span>
                  </div>
                  <h2 className="mt-1 font-serif text-xl text-ink">
                    {phase.title}
                  </h2>
                  <p className="text-xs text-dim mt-0.5">{phase.subtitle}</p>
                </div>
                <div className="text-xs text-faint font-mono">
                  {phaseConcepts.filter((c) => completed.includes(c.id)).length}/
                  {phaseConcepts.length} locked in
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {phaseConcepts.map((c) => {
                  const isDone = completed.includes(c.id);
                  const isUnlocked = isConceptUnlocked(c, completed);
                  return (
                    <ConceptCard
                      key={c.id}
                      id={c.id}
                      title={c.title}
                      short={c.short}
                      phase={c.phase}
                      xp={c.xp}
                      isDone={isDone}
                      isUnlocked={isUnlocked}
                      color={phase.color}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function isConceptUnlocked(
  c: typeof CONCEPTS[number],
  completed: ConceptId[],
): boolean {
  if (c.prereqs.length === 0) return true;
  return c.prereqs.every((p) => completed.includes(p));
}

function ConceptCard({
  id,
  title,
  short,
  phase,
  xp,
  isDone,
  isUnlocked,
  color,
}: {
  id: ConceptId;
  title: string;
  short: string;
  phase: number;
  xp: number;
  isDone: boolean;
  isUnlocked: boolean;
  color: string;
}) {
  const Wrapper: any = isUnlocked ? Link : "div";
  const wrapperProps: any = isUnlocked
    ? { href: `/learn/${id}` }
    : { "aria-disabled": true };

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group relative p-3 rounded-lg border transition",
        isUnlocked
          ? "border-line bg-elev/40 hover:bg-elev/80 hover:border-accent/40 cursor-pointer"
          : "border-line/50 bg-elev/10 opacity-60 cursor-not-allowed",
        isDone && "ring-1 ring-accent/30",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: `${color}20`, color }}
        >
          {id}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-faint">
          {isDone ? (
            <Check size={11} className="text-accent" />
          ) : isUnlocked ? (
            <Circle size={11} />
          ) : (
            <Lock size={11} />
          )}
          <span className="font-mono">+{xp}</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-ink leading-snug">{title}</h3>
      <p className="mt-1 text-xs text-dim leading-relaxed line-clamp-2">{short}</p>
      {isUnlocked && (
        <div className="mt-2 text-[10px] text-accent flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <span>Open</span>
          <ArrowRight size={10} />
        </div>
      )}
    </Wrapper>
  );
}

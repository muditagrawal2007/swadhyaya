"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CONCEPT_BY_ID,
  PHASES,
  getNextConceptId,
  getPrevConceptId,
  getUnlocked,
  type ConceptId,
} from "@/lib/curriculum";
import { useProgress, useIsUnlocked } from "@/lib/progress";
import { QUESTIONS_BY_CONCEPT, type Question } from "@/lib/questions";
import { Playground } from "@/components/playground/Playground";
import { QuestionCard } from "@/components/question/QuestionCard";
import { QuestionNav } from "@/components/question/QuestionNav";
import { Lock, Check, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const fireConfetti = async () => {
  if (typeof window === "undefined") return;
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  const mod = await import("canvas-confetti");
  mod.default({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#e8864a", "#5cb87a", "#6db3ff", "#c98aff", "#ffcc66"],
    disableForReducedMotion: true,
  });
};

type Tab = "story" | "play" | "test" | "whyCare" | "strang" | "connect";

export function ConceptPage({ id }: { id: ConceptId }) {
  const router = useRouter();
  const concept = CONCEPT_BY_ID[id];

  const isUnlocked = useIsUnlocked(concept.id);
  const isDone = useProgress((s) => s.completed.includes(concept.id));
  const complete = useProgress((s) => s.complete);
  const completed = useProgress((s) => s.completed);

  const [tab, setTab] = useState<Tab>("story");
  const [puzzleSolved, setPuzzleSolved] = useState(isDone);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const map: Record<string, Tab | ""> = {
        "1": "story",
        "2": "play",
        "3": "test",
        "4": concept.whyCare ? "whyCare" : "",
        "5": concept.strang ? "strang" : "",
        "6": concept.prereqs.length > 0 ? "connect" : "",
      };
      const next = map[e.key];
      if (next) {
        e.preventDefault();
        setTab(next);
      } else if (e.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [concept.whyCare, concept.strang, concept.prereqs.length, router]);

  const phaseMeta = useMemo(
    () => PHASES.find((p) => p.id === concept.phase)!,
    [concept.phase],
  );

  const nextId = useMemo(() => getNextConceptId(concept.id), [concept.id]);
  const prevId = useMemo(() => getPrevConceptId(concept.id), [concept.id]);
  const nextConcept = nextId ? CONCEPT_BY_ID[nextId] : null;
  const prevConcept = prevId ? CONCEPT_BY_ID[prevId] : null;
  const nextUnlocked = nextId
    ? getUnlocked(new Set(completed)).has(nextId)
    : false;
  const prevUnlocked = prevId
    ? getUnlocked(new Set(completed)).has(prevId)
    : false;

  if (!isUnlocked) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-card border border-line rounded-xl p-8 text-center">
          <Lock size={32} className="mx-auto text-faint" aria-hidden="true" />
          <h1 className="mt-4 font-serif text-2xl text-ink">Locked</h1>
          <p className="mt-2 text-sm text-dim">
            Complete the prerequisites first to unlock this concept.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {concept.prereqs.map((p) => {
              const c = CONCEPT_BY_ID[p];
              const done = completed.includes(p);
              return (
                <Link
                  key={p}
                  href={`/learn/${p}`}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs border",
                    done
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-line bg-elev text-dim",
                  )}
                >
                  {done && (
                    <Check
                      size={10}
                      className="inline mr-1"
                      aria-hidden="true"
                    />
                  )}
                  {c.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const questions = QUESTIONS_BY_CONCEPT[concept.id] ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-xs text-dim hover:text-ink mb-4"
      >
        <ArrowLeft size={12} aria-hidden="true" /> Course map
      </Link>

      <header className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: `${phaseMeta.color}20`, color: phaseMeta.color }}
            >
              {concept.id}
            </span>
            <span className="text-[10px] text-faint uppercase tracking-wider">
              Phase {concept.phase} · {phaseMeta.title}
            </span>
            <span className="text-[10px] text-faint" aria-hidden="true">
              ·
            </span>
            <span className="text-[10px] text-warn">+{concept.xp} XP</span>
          </div>
          <div className="flex items-center gap-1">
            {prevConcept && (
              <Link
                href={`/learn/${prevConcept.id}`}
                className={cn(
                  "inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition",
                  prevUnlocked
                    ? "border-line hover:bg-elev text-dim hover:text-ink"
                    : "border-line/50 text-faint hover:text-dim",
                )}
                aria-label={`Previous story: ${prevConcept.title}`}
              >
                <ArrowLeft size={12} aria-hidden="true" />
                <span className="font-mono text-[10px]">{prevConcept.id}</span>
              </Link>
            )}
            {nextConcept && (
              <Link
                href={`/learn/${nextConcept.id}`}
                className={cn(
                  "inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition",
                  nextUnlocked
                    ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
                    : "border-line/50 text-faint hover:text-dim",
                )}
                aria-label={`Next story: ${nextConcept.title}`}
              >
                <span className="font-mono text-[10px]">{nextConcept.id}</span>
                <ArrowRight size={12} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
        <h1 className="font-serif text-3xl text-ink">{concept.title}</h1>
        <p className="mt-1 text-base text-dim">{concept.short}</p>
      </header>

      <nav
        className="flex items-center gap-1 border-b border-line mb-6 overflow-x-auto"
        role="tablist"
        aria-label="Concept sections"
      >
        <TabButton
          active={tab === "story"}
          onClick={() => setTab("story")}
          n={1}
          id="tab-story"
        >
          Story
        </TabButton>
        <TabButton
          active={tab === "play"}
          onClick={() => setTab("play")}
          n={2}
          id="tab-play"
        >
          Playground
        </TabButton>
        <TabButton
          active={tab === "test"}
          onClick={() => setTab("test")}
          n={3}
          id="tab-test"
        >
          Test
        </TabButton>
        {concept.whyCare && (
          <TabButton
            active={tab === "whyCare"}
            onClick={() => setTab("whyCare")}
            n={4}
            id="tab-why"
          >
            Why care
          </TabButton>
        )}
        {concept.strang && (
          <TabButton
            active={tab === "strang"}
            onClick={() => setTab("strang")}
            n={5}
            id="tab-strang"
          >
            Formal layer
          </TabButton>
        )}
        {concept.prereqs.length > 0 && (
          <TabButton
            active={tab === "connect"}
            onClick={() => setTab("connect")}
            n={6}
            id="tab-connect"
          >
            Connect
          </TabButton>
        )}
        {puzzleSolved && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-accent">
            <Check size={12} aria-hidden="true" /> Locked in
          </span>
        )}
        <span className="ml-auto hidden lg:inline-flex items-center gap-2 text-[10px] text-faint font-mono">
          <kbd className="px-1.5 py-0.5 rounded border border-line bg-elev/50">
            1–6
          </kbd>
          tabs
          <kbd className="px-1.5 py-0.5 rounded border border-line bg-elev/50 ml-1">
            Esc
          </kbd>
          back
        </span>
      </nav>

      {tab === "story" && <StoryTab story={concept.story} />}
      {tab === "play" && <Playground id={concept.playground} />}
      {tab === "whyCare" && concept.whyCare && (
        <WhyCareTab text={concept.whyCare} />
      )}
      {tab === "strang" && concept.strang && <StrangTab text={concept.strang} />}
      {tab === "connect" && (
        <ConnectTab
          prereqs={concept.prereqs}
          currentId={concept.id}
          completed={completed}
        />
      )}
      {tab === "test" && (
        <TestTab
          questions={questions}
          onPass={() => {
            complete(concept.id, concept.xp);
            setPuzzleSolved(true);
            fireConfetti();
          }}
          alreadyDone={isDone}
          nextConcept={
            nextConcept
              ? {
                  id: nextConcept.id,
                  title: nextConcept.title,
                  short: nextConcept.short,
                  phase: nextConcept.phase,
                  xp: nextConcept.xp,
                }
              : null
          }
          nextUnlocked={nextUnlocked}
          onGoToNext={() => router.push(`/learn/${nextConcept?.id}`)}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  n,
  id,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  n: number;
  id: string;
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      id={id}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      className={cn(
        "px-4 py-2.5 text-sm border-b-2 -mb-px transition",
        active
          ? "border-accent text-ink"
          : "border-transparent text-dim hover:text-ink",
      )}
    >
      <span className="text-faint mr-1.5 font-mono text-[10px]">{n}</span>
      {children}
    </button>
  );
}

function StoryTab({ story }: { story: string }) {
  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6">
      <div className="prose prose-invert max-w-none">
        <div className="font-serif text-lg leading-relaxed text-ink/90 whitespace-pre-line">
          {story}
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles size={10} className="text-warn" aria-hidden="true" />
            What to notice
          </div>
          <ul className="text-xs text-dim space-y-1.5 list-disc list-inside leading-relaxed">
            <li>The story is the entry — the math is the formal layer</li>
            <li>When you see a number, ask: what does it MEAN in the story?</li>
            <li>Open the playground — play with the controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function WhyCareTab({ text }: { text: string }) {
  return (
    <div className="bg-card border border-line rounded-xl p-6">
      <div className="text-[10px] text-warn uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Sparkles size={11} aria-hidden="true" /> Why should you care?
      </div>
      <p className="font-serif text-lg leading-relaxed text-ink/90">{text}</p>
      <p className="text-xs text-dim mt-4">
        The intuition you build here shows up everywhere. The playground is the
        practice. Now open the playground tab and play.
      </p>
    </div>
  );
}

function StrangTab({ text }: { text: string }) {
  return (
    <div className="bg-card border border-line rounded-xl p-6">
      <div className="text-[10px] text-faint uppercase tracking-wider mb-3 flex items-center gap-1.5">
        Formal layer · Gilbert Strang
      </div>
      <p className="font-serif text-base leading-relaxed text-ink/90">{text}</p>
      <p className="text-xs text-dim mt-4">
        The interactive playground above IS the geometry Strang describes in
        symbols. Watch the picture move, then read the algebra — same idea, two
        languages.
      </p>
    </div>
  );
}

function ConnectTab({
  prereqs,
  currentId: _currentId,
  completed,
}: {
  prereqs: ConceptId[];
  currentId: ConceptId;
  completed: ConceptId[];
}) {
  const prereqConcepts = useMemo(
    () =>
      prereqs
        .map((id) => CONCEPT_BY_ID[id])
        .filter(
          (c): c is (typeof CONCEPT_BY_ID)[ConceptId] => c !== undefined,
        ),
    [prereqs],
  );
  return (
    <div className="space-y-4">
      <div className="bg-card border border-line rounded-xl p-6">
        <div className="text-[10px] text-faint uppercase tracking-wider mb-3">
          This concept rests on
        </div>
        <div className="space-y-2">
          {prereqConcepts.length === 0 ? (
            <p className="text-sm text-dim">
              This is a starting concept — no prerequisites.
            </p>
          ) : (
            prereqConcepts.map((c) => {
              const done = completed.includes(c.id);
              return (
                <Link
                  key={c.id}
                  href={`/learn/${c.id}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                    done
                      ? "border-accent/30 bg-accent/5 hover:bg-accent/10"
                      : "border-line bg-elev/30 hover:bg-elev/60"
                  }`}
                >
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: "var(--bg-elev)",
                      color: done ? "var(--accent)" : "var(--ink-dim)",
                    }}
                  >
                    {c.id}
                  </span>
                  <span className="text-sm text-ink flex-1">{c.title}</span>
                  {done ? (
                    <span className="text-[10px] text-accent">✓ locked in</span>
                  ) : (
                    <span className="text-[10px] text-faint">review</span>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
      <div className="bg-elev/40 border border-line rounded-xl p-4 text-xs text-dim leading-relaxed">
        The curriculum is a directed graph: each concept unlocks the next. The
        chain never breaks. Every concept is downstream of everything above it.
      </div>
    </div>
  );
}

function TestTab({
  questions,
  onPass,
  alreadyDone,
  nextConcept,
  nextUnlocked,
  onGoToNext,
}: {
  questions: Question[];
  onPass: () => void;
  alreadyDone: boolean;
  nextConcept: {
    id: string;
    title: string;
    short: string;
    phase: number;
    xp: number;
  } | null;
  nextUnlocked: boolean;
  onGoToNext: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [correctMap, setCorrectMap] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [wrongAttempts, setWrongAttempts] = useState<Record<string, number>>({});

  const correctCount = useMemo(
    () => Object.values(correctMap).filter(Boolean).length,
    [correctMap],
  );

  if (!questions.length) {
    return (
      <div className="bg-card border border-line rounded-xl p-6 text-center text-dim">
        Questions coming soon for this concept.
      </div>
    );
  }

  const q = questions[idx];
  if (!q) return null;
  const answeredCount = Object.keys(submitted).length;
  const allCorrect =
    answeredCount === questions.length && correctCount === questions.length;

  const handleCheck = () => {
    const chosenId = answers[q.id];
    if (!chosenId) return;
    const chosen = q.options.find((o) => o.id === chosenId);
    if (chosen?.correct) {
      setSubmitted({ ...submitted, [q.id]: true });
      setCorrectMap({ ...correctMap, [q.id]: true });
    } else {
      setSubmitted({ ...submitted, [q.id]: true });
      setCorrectMap({ ...correctMap, [q.id]: false });
      setWrongAttempts({
        ...wrongAttempts,
        [q.id]: (wrongAttempts[q.id] || 0) + 1,
      });
    }
  };

  const handleRetry = () => {
    const newSub = { ...submitted };
    delete newSub[q.id];
    setSubmitted(newSub);
  };

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6">
      <div>
        <QuestionCard
          question={q}
          index={idx}
          total={questions.length}
          selected={answers[q.id]}
          submitted={!!submitted[q.id]}
          isCorrect={correctMap[q.id] === true}
          showHint={!!showHint[q.id]}
          wrongAttempts={wrongAttempts[q.id] || 0}
          isLast={idx === questions.length - 1}
          onSelect={(id) => setAnswers({ ...answers, [q.id]: id })}
          onCheck={handleCheck}
          onShowHint={() => setShowHint({ ...showHint, [q.id]: true })}
          onRetry={handleRetry}
          onNext={() => setIdx(idx + 1)}
        />

        {allCorrect && (
          <div
            className={cn(
              "mt-6 rounded-2xl p-8 text-center transition",
              nextUnlocked
                ? "bg-gradient-to-b from-accent/15 via-accent/10 to-card border border-accent/40 shadow-[0_0_24px_-12px_var(--accent)]"
                : "bg-accent/10 border border-accent/40",
            )}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 border border-accent/40">
              <Sparkles size={22} className="text-accent" aria-hidden="true" />
            </div>
            <h3 className="mt-3 font-serif text-2xl text-ink">
              All correct — locked in
            </h3>
            <p className="text-sm text-dim mt-1">
              +{questions.reduce((s, qq) => s + qq.xp, 0)} XP earned across{" "}
              {questions.length} questions
            </p>

            {nextConcept && (
              <div className="mt-5 mx-auto max-w-md">
                <div className="text-[10px] text-faint uppercase tracking-widest mb-1.5">
                  Next story
                </div>
                <div
                  className="rounded-lg border border-line bg-card/60 px-4 py-3 text-left"
                  aria-label="Next concept preview"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: `${PHASES.find((p) => p.id === nextConcept.phase)?.color ?? "#888"}20`,
                        color:
                          PHASES.find((p) => p.id === nextConcept.phase)?.color ??
                          "#888",
                      }}
                    >
                      {nextConcept.id}
                    </span>
                    <span className="text-[10px] text-faint">
                      +{nextConcept.xp} XP
                    </span>
                    {!nextUnlocked && (
                      <span className="ml-auto text-[10px] text-faint inline-flex items-center gap-1">
                        <Lock size={10} aria-hidden="true" /> preview only
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-ink">
                    {nextConcept.title}
                  </div>
                  <div className="text-xs text-dim mt-0.5">
                    {nextConcept.short}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {nextConcept &&
                (alreadyDone ? (
                  <Link
                    href={`/learn/${nextConcept.id}`}
                    className={cn(
                      "px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition text-base",
                      nextUnlocked
                        ? "bg-ink text-canvas hover:opacity-90 shadow-lg"
                        : "border border-line bg-elev/40 text-dim hover:bg-elev",
                    )}
                  >
                    {nextUnlocked
                      ? "Continue to next story"
                      : "Preview next story"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      onPass();
                      onGoToNext();
                    }}
                    className="px-6 py-3 rounded-lg bg-ink text-canvas font-semibold inline-flex items-center gap-2 hover:opacity-90 transition text-base shadow-lg"
                  >
                    Continue to next story
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ))}
              <button
                onClick={onPass}
                disabled={alreadyDone}
                className="px-4 py-2 rounded text-xs border border-line/50 text-dim hover:bg-elev disabled:opacity-40"
              >
                {alreadyDone ? "Already locked in" : "Mark complete only"}
              </button>
            </div>

            {!nextConcept && (
              <p className="mt-4 text-xs text-accent font-medium">
                You finished the entire curriculum. ✦
              </p>
            )}
          </div>
        )}
      </div>

      <QuestionNav
        questions={questions}
        activeIndex={idx}
        correctMap={correctMap}
        onJump={setIdx}
      />
    </div>
  );
}
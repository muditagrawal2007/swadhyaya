"use client";
import { useState, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { CONCEPT_BY_ID, type ConceptId } from "@/lib/curriculum";
import { useProgress, useIsUnlocked } from "@/lib/progress";
import { QUESTIONS_BY_CONCEPT, type Question } from "@/lib/questions";
import { Playground } from "@/components/playground/Playground";
import { Lock, Check, ChevronRight, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export default function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const concept = CONCEPT_BY_ID[id as ConceptId];

  if (!concept) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-2xl text-ink">Concept not found</h1>
        <Link href="/learn" className="mt-4 text-accent hover:underline">Back to course map</Link>
      </div>
    );
  }

  const isUnlocked = useIsUnlocked(concept.id);
  const isDone = useProgress((s) => s.completed.includes(concept.id));
  const complete = useProgress((s) => s.complete);
  const completed = useProgress((s) => s.completed);

  const [tab, setTab] = useState<"story" | "play" | "test">("story");
  const [puzzleSolved, setPuzzleSolved] = useState(isDone);

  if (!isUnlocked) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-card border border-line rounded-xl p-8 text-center">
          <Lock size={32} className="mx-auto text-faint" />
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
                  {done && <Check size={10} className="inline mr-1" />}
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
      <Link href="/learn" className="inline-flex items-center gap-1 text-xs text-dim hover:text-ink mb-4">
        <ArrowLeft size={12} /> Course map
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: `${PHASE_COLORS[concept.phase]}20`, color: PHASE_COLORS[concept.phase] }}
          >
            {concept.id}
          </span>
          <span className="text-[10px] text-faint uppercase tracking-wider">
            Phase {concept.phase} · {PHASE_NAMES[concept.phase]}
          </span>
          <span className="text-[10px] text-faint">·</span>
          <span className="text-[10px] text-warn">+{concept.xp} XP</span>
        </div>
        <h1 className="font-serif text-3xl text-ink">{concept.title}</h1>
        <p className="mt-1 text-base text-dim">{concept.short}</p>
      </header>

      <nav className="flex items-center gap-1 border-b border-line mb-6">
        <TabButton active={tab === "story"} onClick={() => setTab("story")} n={1}>Story</TabButton>
        <TabButton active={tab === "play"} onClick={() => setTab("play")} n={2}>Playground</TabButton>
        <TabButton active={tab === "test"} onClick={() => setTab("test")} n={3}>Test</TabButton>
        {puzzleSolved && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-accent">
            <Check size={12} /> Locked in
          </span>
        )}
      </nav>

      {tab === "story" && <StoryTab story={concept.story} />}
      {tab === "play" && <Playground id={concept.playground} />}
      {tab === "test" && (
        <TestTab
          questions={questions}
          onPass={() => {
            complete(concept.id, concept.xp);
            setPuzzleSolved(true);
          }}
          alreadyDone={isDone}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, children, n }: { active: boolean; onClick: () => void; children: React.ReactNode; n: number }) {
  return (
    <button
      onClick={onClick}
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
            <Sparkles size={10} className="text-warn" />
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

function TestTab({
  questions,
  onPass,
  alreadyDone,
}: {
  questions: Question[];
  onPass: () => void;
  alreadyDone: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [wrongAttempts, setWrongAttempts] = useState<Record<string, number>>({});

  if (!questions.length) {
    return (
      <div className="bg-card border border-line rounded-xl p-6 text-center text-dim">
        Questions coming soon for this concept.
      </div>
    );
  }

  const q = questions[idx];
  const correctCount = questions.filter((qq) => answers[qq.id] && qq.options.find((o) => o.id === answers[qq.id])?.correct).length;
  const totalAnswered = questions.filter((qq) => submitted[qq.id]).length;
  const allCorrect = correctCount === questions.length && totalAnswered === questions.length;

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6">
      <div>
        <div className="bg-card border border-line rounded-xl p-6">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-3">
            Question {idx + 1} of {questions.length}
          </div>
          <h3 className="font-serif text-xl text-ink mb-5">{q.prompt}</h3>
          <div className="space-y-2">
            {q.options.map((o) => {
              const isAnswered = submitted[q.id];
              const selected = answers[q.id] === o.id;
              const isCorrect = o.correct;
              let cls = "border-line bg-elev/30 hover:bg-elev/60 text-ink";
              if (isAnswered) {
                if (selected && isCorrect) cls = "border-accent bg-accent/20 text-accent";
                else if (selected && !isCorrect) cls = "border-warn bg-warn/20 text-warn";
                else if (!selected && isCorrect) cls = "border-accent/30 bg-accent/5 text-accent/70";
              }
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    if (isAnswered) return;
                    setAnswers({ ...answers, [q.id]: o.id });
                  }}
                  className={cn("w-full text-left p-3 rounded-lg border transition", cls)}
                >
                  <span className="font-mono text-xs text-faint mr-2">{o.id.toUpperCase()}</span>
                  {o.label}
                </button>
              );
            })}
          </div>

          {!submitted[q.id] ? (
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  if (!answers[q.id]) return;
                  const chosen = q.options.find((o) => o.id === answers[q.id]);
                  if (chosen?.correct) {
                    setSubmitted({ ...submitted, [q.id]: true });
                  } else {
                    setWrongAttempts({ ...wrongAttempts, [q.id]: (wrongAttempts[q.id] || 0) + 1 });
                  }
                }}
                disabled={!answers[q.id]}
                className="px-4 py-2 rounded bg-accent text-canvas font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/90 transition"
              >
                Check
              </button>
              {(wrongAttempts[q.id] || 0) >= 1 && (
                <button
                  onClick={() => setShowHint({ ...showHint, [q.id]: true })}
                  className="text-xs text-warn hover:text-warn/80"
                >
                  Show hint
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="bg-elev/40 border border-line rounded p-3 text-sm text-dim leading-relaxed">
                <span className="text-ink font-medium">Why: </span>
                {q.explanation}
              </div>
              <button
                onClick={() => setIdx(Math.min(idx + 1, questions.length - 1))}
                disabled={idx === questions.length - 1}
                className="px-4 py-2 rounded border border-line text-ink hover:bg-elev transition disabled:opacity-30"
              >
                Next question <ChevronRight size={14} className="inline" />
              </button>
            </div>
          )}

          {showHint[q.id] && (
            <div className="mt-3 bg-warn/10 border border-warn/30 rounded p-3 text-xs text-warn/90 leading-relaxed">
              <span className="font-medium">Hint: </span>
              {q.hint}
            </div>
          )}
        </div>

        {allCorrect && (
          <div className="mt-4 bg-accent/10 border border-accent/40 rounded-xl p-6 text-center">
            <Sparkles size={24} className="mx-auto text-accent" />
            <h3 className="mt-2 font-serif text-xl text-ink">All correct — locked in</h3>
            <p className="text-sm text-dim mt-1">+{questions.reduce((s, qq) => s + qq.xp, 0)} XP earned</p>
            <button
              onClick={onPass}
              disabled={alreadyDone}
              className="mt-4 px-5 py-2.5 rounded bg-accent text-canvas font-medium disabled:opacity-50"
            >
              {alreadyDone ? "Already locked in" : "Mark complete & continue"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-[10px] text-faint uppercase tracking-wider">Progress</div>
        <div className="bg-card border border-line rounded-xl p-3">
          <div className="text-2xl font-mono text-ink">
            {correctCount}<span className="text-faint text-sm"> / {questions.length}</span>
          </div>
          <div className="text-xs text-dim mt-1">correct</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {questions.map((qq, i) => {
            const isCorrect = submitted[qq.id] && qq.options.find((o) => o.id === answers[qq.id])?.correct;
            const isWrong = submitted[qq.id] && !isCorrect;
            return (
              <button
                key={qq.id}
                onClick={() => setIdx(i)}
                className={cn(
                  "flex items-center justify-between p-2 rounded text-xs border transition",
                  i === idx
                    ? "border-accent bg-accent/10"
                    : "border-line bg-elev/30 hover:bg-elev/60",
                  isCorrect && "text-accent",
                  isWrong && "text-warn",
                )}
              >
                <span>Q{i + 1}</span>
                {isCorrect && <Check size={11} />}
                {isWrong && <span>×</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PHASE_NAMES: Record<number, string> = {
  1: "Systems of Linear Equations",
  2: "Vector Spaces",
  3: "Linear Transformations",
  4: "Four Subspaces & Dual",
  5: "Eigenvalues & Eigenvectors",
  6: "SVD & Applications",
};

const PHASE_COLORS: Record<number, string> = {
  1: "#ff4d6d",
  2: "#4d9bff",
  3: "#00ffa3",
  4: "#b96bff",
  5: "#ffd24d",
  6: "#ff9a3c",
};

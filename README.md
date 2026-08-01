# Swadhyaya

Intuition-first Linear Algebra. Learn by playing, not by formula.

A gamified, story-first, fully interactive learning platform for the full
linear algebra curriculum — from "what is a number on a line" to SVD,
eigen-decomposition, and PCA. 43 concepts across 6 phases, each with its
own dedicated interactive playground.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 (or the next free port if 3000 is taken).

```bash
pnpm build   # production build
pnpm typecheck
```

## Teaching philosophy

No formula memorization. Every concept is taught as a 4-act experience:

1. **Story** — a real-world narrative (Ram & Lakshman's pocket money, Atul
   walking to Bala's house, the Hill cipher). No jargon. No Greek letters.
2. **Playground** — an interactive widget built specifically for THIS concept
   (no two concepts share a playground). Drag controls, see the math live.
3. **Test** — 1-2 challenges that prove the intuition stuck. Wrong answers
   reveal the correct option (highlighted green) and the explanation, so
   the student walks away knowing the right answer, not just "I was wrong".
4. **Lock-in** — completing the test unlocks the next concept in the chain.
   The chain never breaks.

## Curriculum

43 concepts across 6 phases, following **Prof. Sudarshan Iyengar's NPTEL
sequence** (concrete first, abstraction earned, matrix-of-transformation
gets its own module, dual space is first-class):

1. **Systems of Linear Equations** (L1–L8) — what is an equation → Ax=b →
   row operations → RREF → homogeneous vs non-homogeneous
2. **Vector Spaces** (V1–V8) — arrows → linear combinations → subspaces →
   span → independence → basis → dimension
3. **Linear Transformations** (T1–T8) — what they are → why linearity matters
   → the matrix of a transformation → null/range → rank-nullity → isomorphism
   → composition → inverse
4. **Four Subspaces & Dual Space** (F1–F8) — the four fundamental subspaces,
   row vs column space, linear functionals, the dual space V*, dual basis,
   annihilator, transpose T*, the double-dual theorem V** = V
5. **Eigenvalues & Eigenvectors** (E1–E6) — discovery, eigenvalue,
   characteristic polynomial, diagonalization, Cayley-Hamilton, minimal poly
6. **SVD & Applications** (S1–S5) — A = UΣVᵀ decomposition, SVD image
   compression, PCA, least squares as projection

Every concept has its own dedicated playground — no shared widgets. The
playground renders live math (eigenvectors, SVD, RREF, PCA axes, etc.)
computed in the browser via a hand-rolled linear algebra engine in
`lib/math.ts`.

## Stack

- **Next.js 15** (App Router) + **TypeScript** strict
- **Tailwind CSS** with a custom warm-dark theme (aligned with
  [Tenali](https://github.com/vicharanashala/tenali))
- Custom **SVG vector canvas** (`components/viz/VectorCanvas.tsx`) — we own
  every pixel, no chart library
- **Zustand** with localStorage persistence for progress, XP, streak
- **Math.js** for general parsing where needed
- **No emoji in chrome** — lucide-react SVG icons only
- **Dark theme** by default: warm brown canvas (#1a1614) + warm orange accent
  (#e8864a) + serif headlines (Source Serif 4) + DM Sans body

## Deploying to your own server

The app is a standard Next.js 15 production app. After `pnpm build`:

```bash
pnpm start   # serves the production build on :3000
```

For deployment to your own infrastructure (Vercel, your samagama.in server,
anywhere Next.js runs):

```bash
pnpm build && pnpm start --port 3000
```

Environment variables (see `.env.example`):

```env
# Samagama.in auth (when you wire it)
NEXT_PUBLIC_SAMAGAMA_AUTH_URL=...
SAMAGAMA_CLIENT_SECRET=...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Swadhyaya
```

The current `lib/auth.ts` is a **placeholder** — a demo user is created on
"Sign in" click. Replace the `login()` function with the real samagama.in
OAuth flow once you have the auth API spec.

## Credits

The platform is a synthesis of four teaching traditions:

- **[Prof. Sudarshan Iyengar](https://nptel.ac.in/courses/111106051)** — IIT
  Madras NPTEL "Mathematics: Linear Algebra". The rigorous sequence.
- **[Sudarshan's Codershigh Matrix Mystics](https://sudarshansudarshan.github.io/codershigh/matrixmystics/)**
  — the story-first problem style. Hill cipher, PageRank, etc.
- **[3Blue1Brown](https://www.3blue1brown.com/topics/linear-algebra)** —
  the visual sequencing. "Matrix = where i-hat and j-hat go."
- **[Kalid Azad / BetterExplained](https://betterexplained.com/articles/linear-algebra-guide/)**
  — the "explain it like a friend at coffee" voice.
- **[Gilbert Strang](https://math.mit.edu/~gs)** — the formal layer (cited,
  not reproduced).

Theme inspired by [Tenali](https://github.com/vicharanashala/tenali)'s warm
dark palette.

## License

MIT

// Question bank. For each concept, 3-5 questions. Each has a unique id.
// Types: "predict" (predict output), "match" (which picture), "rank" (order), "identify" (which property)

export type QuestionType = "predict" | "match" | "rank" | "identify" | "truefalse" | "fill";

export interface Question {
  id: string;
  conceptId: string;
  type: QuestionType;
  prompt: string;
  hint: string;
  xp: number;
  options: Array<{ id: string; label: string; correct?: boolean }>;
  explanation: string;
}

// Helper: build a question
let _qid = 0;
const q = (
  conceptId: string,
  type: QuestionType,
  prompt: string,
  options: Array<{ id: string; label: string; correct?: boolean }>,
  explanation: string,
  hint: string = "Re-read the playground carefully.",
  xp: number = 10,
): Question => ({ id: `${conceptId}-${++_qid}`, conceptId, type, prompt, options, explanation, hint, xp });

export const QUESTIONS: Question[] = [
  // L1
  q("L1", "predict",
    "If 2x + 3 = 11, what is x?",
    [
      { id: "a", label: "x = 4", correct: true },
      { id: "b", label: "x = 3" },
      { id: "c", label: "x = 5" },
      { id: "d", label: "x = 8" },
    ],
    "2x = 8, so x = 4. The two sides of the equation agree at x = 4."),
  q("L1", "truefalse",
    "The equation y = 2x + 1 is satisfied at the point (0, 0).",
    [
      { id: "a", label: "True" },
      { id: "b", label: "False", correct: true },
    ],
    "At x = 0, y = 1, not 0. (0, 0) does not satisfy the equation."),

  // L2
  q("L2", "predict",
    "Two lines y = 2x + 1 and y = -x + 4. Where do they meet?",
    [
      { id: "a", label: "(1, 3)", correct: true },
      { id: "b", label: "(2, 5)" },
      { id: "c", label: "(0, 4)" },
      { id: "d", label: "Never" },
    ],
    "Set equal: 2x + 1 = -x + 4, so 3x = 3, x = 1. y = 2(1) + 1 = 3."),
  q("L2", "truefalse",
    "If two lines have the same slope, they meet at exactly one point.",
    [
      { id: "a", label: "True" },
      { id: "b", label: "False", correct: true },
    ],
    "Parallel lines (same slope, different intercept) never meet. They have no point in common."),

  // L3
  q("L3", "predict",
    "Three equations in three unknowns usually have…",
    [
      { id: "a", label: "Always one solution" },
      { id: "b", label: "One solution, sometimes none, sometimes infinite", correct: true },
      { id: "c", label: "Always infinite solutions" },
      { id: "d", label: "Never a solution" },
    ],
    "Three planes in 3D can meet at a point (one solution), be inconsistent (none), or share a line/plane (infinite)."),

  // L4
  q("L4", "predict",
    "A = [[1,2],[3,4]], x = [1,1]. What is Ax?",
    [
      { id: "a", label: "[3, 7]", correct: true },
      { id: "b", label: "[1, 1]" },
      { id: "c", label: "[4, 6]" },
      { id: "d", label: "[2, 3]" },
    ],
    "First component: 1·1 + 2·1 = 3. Second: 3·1 + 4·1 = 7. So Ax = [3, 7].",
    "Each row of A is dotted with x. Row 1: 1·1 + 2·1. Row 2: 3·1 + 4·1."),
  q("L4", "truefalse",
    "Matrix multiplication Ax is the same as applying the linear transformation A to the vector x.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes — the matrix of a transformation is the operator, and Ax IS the transformation applied to x."),

  // L5
  q("L5", "match",
    "Which row operation keeps the answer the same?",
    [
      { id: "a", label: "Add a multiple of one row to another", correct: true },
      { id: "b", label: "Change the first entry of a row to 0" },
      { id: "c", label: "Multiply a row by 0" },
      { id: "d", label: "Reorder the unknowns" },
    ],
    "Swap, scale (by non-zero), and add-multiple are the three valid row operations."),

  // L6
  q("L6", "predict",
    "In row-echelon form, where are the leading non-zero entries?",
    [
      { id: "a", label: "On the diagonal, each strictly to the right of the one above", correct: true },
      { id: "b", label: "All in column 1" },
      { id: "c", label: "Random" },
      { id: "d", label: "All in the last row" },
    ],
    "Echelon = staircase. Pivots go right as you go down, all entries below each pivot are zero."),
  q("L6", "truefalse",
    "Every system of linear equations has a unique row-echelon form.",
    [
      { id: "a", label: "True" },
      { id: "b", label: "False", correct: true },
    ],
    "Echelon form is NOT unique — you can swap rows. RREF is unique, but plain echelon is not."),

  // L7
  q("L7", "truefalse",
    "RREF is unique for every matrix.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes — RREF is the unique reduced form. Two different paths to RREF will give the same final matrix."),

  // L8
  q("L8", "predict",
    "Ax = 0 (homogeneous) always has which solution?",
    [
      { id: "a", label: "x = 0", correct: true },
      { id: "b", label: "x = [1, 1]" },
      { id: "c", label: "No solution" },
      { id: "d", label: "It depends on A" },
    ],
    "x = 0 always satisfies Ax = 0. The question is whether OTHER (non-trivial) solutions exist."),
  q("L8", "truefalse",
    "A non-homogeneous system Ax = b with b ≠ 0 always has exactly one solution.",
    [
      { id: "a", label: "True" },
      { id: "b", label: "False", correct: true },
    ],
    "No — it might have 0, 1, or infinitely many depending on whether b is in the column space and whether A has a null space."),

  // V1
  q("V1", "predict",
    "Two arrows are the SAME vector if…",
    [
      { id: "a", label: "They have the same length and direction (regardless of position)", correct: true },
      { id: "b", label: "They start at the origin" },
      { id: "c", label: "They look the same" },
      { id: "d", label: "They end at the same point" },
    ],
    "Vectors are about direction and magnitude, not position. Slide them around — same vector."),
  q("V1", "truefalse",
    "The vector from (1,1) to (3,5) is the same as the vector (2,4).",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "(3-1, 5-1) = (2, 4). Same arrow, different starting point."),

  // V2
  q("V2", "predict",
    "v = (1, 2) and w = (3, 1). What is v + w?",
    [
      { id: "a", label: "(4, 3)", correct: true },
      { id: "b", label: "(3, 2)" },
      { id: "c", label: "(1, 1)" },
      { id: "d", label: "(4, 2)" },
    ],
    "Add components: (1+3, 2+1) = (4, 3). Head-to-tail: walk v then walk w."),
  q("V2", "predict",
    "3 × (1, 2) = ?",
    [
      { id: "a", label: "(3, 6)", correct: true },
      { id: "b", label: "(4, 5)" },
      { id: "c", label: "(1, 6)" },
      { id: "d", label: "(3, 2)" },
    ],
    "Scale each component: (3·1, 3·2) = (3, 6)."),

  // V3
  q("V3", "truefalse",
    "A single point is a vector space.",
    [
      { id: "a", label: "True" },
      { id: "b", label: "False", correct: true },
    ],
    "A single point is the zero-dimensional space {0} — but only the ORIGIN alone is a vector space. A non-origin point is not."),

  // V4
  q("V4", "predict",
    "Which of these is a subspace of R²?",
    [
      { id: "a", label: "A line through the origin", correct: true },
      { id: "b", label: "A line not through the origin" },
      { id: "c", label: "A circle" },
      { id: "d", label: "A square" },
    ],
    "A line through origin: closed under add and scale. A line not through origin: scaling by 0 takes you to origin, but the line doesn't contain origin, so not closed."),

  // V5
  q("V5", "predict",
    "Three vectors in R² that are not all parallel — what is their span?",
    [
      { id: "a", label: "All of R²", correct: true },
      { id: "b", label: "A line" },
      { id: "c", label: "Just the origin" },
      { id: "d", label: "A plane in R³" },
    ],
    "Two non-parallel vectors in R² already span all of R². Adding a third (in R²) doesn't expand it."),

  // V6
  q("V6", "predict",
    "Two vectors v, w in R² are linearly independent if and only if…",
    [
      { id: "a", label: "They are not parallel", correct: true },
      { id: "b", label: "They have the same length" },
      { id: "c", label: "They point the same way" },
      { id: "d", label: "They both pass through origin" },
    ],
    "If they're parallel, one is a scalar multiple of the other → dependent. If not, independent."),

  // V7
  q("V7", "truefalse",
    "A basis must be a linearly independent set that also spans the space.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Both conditions. Span = cover the space. Independence = no redundancy. Together = basis."),

  // V8
  q("V8", "predict",
    "If a vector space has a basis of 4 vectors, its dimension is…",
    [
      { id: "a", label: "4", correct: true },
      { id: "b", label: "It depends on the basis" },
      { id: "c", label: "At least 4" },
      { id: "d", label: "Could be anything" },
    ],
    "Dimension is the size of any basis. All bases have the same size. So dimension = 4."),

  // T1
  q("T1", "truefalse",
    "Every function is a linear transformation.",
    [
      { id: "a", label: "True" },
      { id: "b", label: "False", correct: true },
    ],
    "Most functions are NOT linear. Linear means preserving add and scale — most functions don't."),

  // T2
  q("T2", "predict",
    "If T is linear, what is T(2v)?",
    [
      { id: "a", label: "2T(v)", correct: true },
      { id: "b", label: "T(v) + 1" },
      { id: "c", label: "T(v)²" },
      { id: "d", label: "T(v)/2" },
    ],
    "T(cv) = cT(v) is one of the two linearity rules. Scaling the input scales the output by the same amount."),

  // T3
  q("T3", "predict",
    "If T(i) = (2, 0) and T(j) = (0, 3), what is the matrix of T?",
    [
      { id: "a", label: "[[2, 0], [0, 3]]", correct: true },
      { id: "b", label: "[[2, 3], [0, 0]]" },
      { id: "c", label: "[[0, 2], [3, 0]]" },
      { id: "d", label: "[[3, 0], [0, 2]]" },
    ],
    "The columns of the matrix ARE T(i) and T(j). So col 1 = (2, 0), col 2 = (0, 3)."),

  // T4
  q("T4", "predict",
    "For T: R² → R² given by T(x, y) = (x + 2y, 2x + 4y), what is in the null space?",
    [
      { id: "a", label: "The line 2y + x = 0", correct: true },
      { id: "b", label: "All of R²" },
      { id: "c", label: "Just the origin" },
      { id: "d", label: "Nothing" },
    ],
    "Setting T(x,y) = 0: x + 2y = 0 → x = -2y → all vectors (-2y, y) = y(-2, 1). The line 2y + x = 0."),

  // T5
  q("T5", "predict",
    "If T: R⁵ → R⁵ and the null space has dimension 2, what is the rank?",
    [
      { id: "a", label: "3", correct: true },
      { id: "b", label: "5" },
      { id: "c", label: "2" },
      { id: "d", label: "10" },
    ],
    "rank + nullity = 5. nullity = 2, so rank = 3."),

  // T6
  q("T6", "truefalse",
    "R² and the space of polynomials of degree ≤ 1 are isomorphic.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Both are 2-dimensional over R. Map (a, b) ↔ a + bx. Same shape, different labels."),

  // T7
  q("T7", "predict",
    "If A = [[1, 1], [0, 1]] and B = [[2, 0], [0, 2]], what is BA?",
    [
      { id: "a", label: "[[2, 2], [0, 2]]", correct: true },
      { id: "b", label: "[[2, 2], [0, 2]]" },
      { id: "c", label: "[[2, 0], [2, 2]]" },
      { id: "d", label: "[[2, 0], [0, 2]]" },
    ],
    "BA = [[2·1+0·0, 2·1+0·1], [0·1+2·0, 0·1+2·1]] = [[2, 2], [0, 2]]."),
  q("T7", "truefalse",
    "Matrix multiplication is commutative: AB = BA always.",
    [
      { id: "a", label: "True" },
      { id: "b", label: "False", correct: true },
    ],
    "Almost never. AB ≠ BA in general. Order matters — composition is right-to-left."),

  // T8
  q("T8", "predict",
    "If A = [[1, 2], [2, 4]], what is A⁻¹?",
    [
      { id: "a", label: "It doesn't exist", correct: true },
      { id: "b", label: "[[1, -2], [-2, 4]]" },
      { id: "c", label: "[[4, -2], [-2, 1]]" },
      { id: "d", label: "Identity" },
    ],
    "det(A) = 1·4 - 2·2 = 0. det = 0 means A collapses a dimension — no inverse exists."),
  q("T8", "truefalse",
    "If A is invertible, then A collapses no dimensions.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Invertible = one-to-one = no information lost = no dimension collapsed. det ≠ 0."),

  // F1
  q("F1", "predict",
    "The four fundamental subspaces of an m×n matrix A live in which spaces?",
    [
      { id: "a", label: "Rⁿ and Rᵐ", correct: true },
      { id: "b", label: "All in Rᵐ" },
      { id: "c", label: "All in Rⁿ" },
      { id: "d", label: "Rᵐ⁺ⁿ" },
    ],
    "Col space ⊂ Rᵐ, row space ⊂ Rⁿ, null space ⊂ Rⁿ, left-null space ⊂ Rᵐ."),
  q("F1", "truefalse",
    "dim(C(A)) + dim(N(A)) = n.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes — column space + null space dimensions = n. This is the rank-nullity theorem."),

  // F3
  q("F3", "truefalse",
    "The dot product f(v) = v · w is a linear functional for any fixed w.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes — f(v + u) = (v+u)·w = v·w + u·w = f(v) + f(u), and f(cv) = c·f(v). Linear."),

  // F4
  q("F4", "predict",
    "If V is 5-dimensional, what is the dimension of V*?",
    [
      { id: "a", label: "5", correct: true },
      { id: "b", label: "10" },
      { id: "c", label: "25" },
      { id: "d", label: "1" },
    ],
    "V* has the same dimension as V. They're different kinds of objects but the same size."),

  // F6
  q("F6", "predict",
    "If W is a 3D subspace of a 5D space, what is dim(W°)?",
    [
      { id: "a", label: "2", correct: true },
      { id: "b", label: "3" },
      { id: "c", label: "5" },
      { id: "d", label: "8" },
    ],
    "dim(W) + dim(W°) = dim(V). 3 + dim(W°) = 5. dim(W°) = 2."),

  // F7
  q("F7", "truefalse",
    "If T has matrix A, then T* has matrix Aᵀ.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes. The transpose of a transformation is the matrix transpose."),

  // F8
  q("F8", "truefalse",
    "For finite-dimensional V, V** is naturally isomorphic to V.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes — the double-dual theorem. Each vector in V corresponds to a unique functional on V*."),

  // E1
  q("E1", "predict",
    "For matrix [[2, 0], [0, 3]], which vector is an eigenvector?",
    [
      { id: "a", label: "(1, 0)", correct: true },
      { id: "b", label: "(1, 1)" },
      { id: "c", label: "(1, 2)" },
      { id: "d", label: "(0, 1)" },
    ],
    "A·(1,0) = (2, 0) = 2·(1, 0). Yes, (1, 0) is an eigenvector with eigenvalue 2."),
  q("E1", "truefalse",
    "Every vector is an eigenvector of some matrix.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes — the identity matrix has EVERY non-zero vector as an eigenvector (with eigenvalue 1)."),

  // E2
  q("E2", "predict",
    "If Av = -2v, what is the eigenvalue?",
    [
      { id: "a", label: "-2", correct: true },
      { id: "b", label: "2" },
      { id: "c", label: "0" },
      { id: "d", label: "1" },
    ],
    "λ = -2. The vector is flipped and stretched by 2."),

  // E3
  q("E3", "predict",
    "The characteristic polynomial of a 3×3 matrix has degree…",
    [
      { id: "a", label: "3", correct: true },
      { id: "b", label: "6" },
      { id: "c", label: "9" },
      { id: "d", label: "1" },
    ],
    "Degree = n for an n×n matrix. So degree 3."),

  // E4
  q("E4", "truefalse",
    "A matrix is diagonalizable if and only if it has n linearly independent eigenvectors.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes. n independent eigenvectors → can form P → A = PDP⁻¹."),

  // S1
  q("S1", "predict",
    "Every m×n matrix A can be decomposed as…",
    [
      { id: "a", label: "U Σ Vᵀ", correct: true },
      { id: "b", label: "QR" },
      { id: "c", label: "LU" },
      { id: "d", label: "AB" },
    ],
    "SVD: A = U Σ Vᵀ. Always, for any matrix."),

  // S2
  q("S2", "predict",
    "In SVD, the columns of U and V are…",
    [
      { id: "a", label: "Orthonormal vectors", correct: true },
      { id: "b", label: "Any basis" },
      { id: "c", label: "The same vectors" },
      { id: "d", label: "Eigenvectors of A" },
    ],
    "U and V are orthogonal matrices. Their columns are orthonormal — perpendicular unit vectors."),

  // S3
  q("S3", "predict",
    "Singular values are always…",
    [
      { id: "a", label: "Non-negative", correct: true },
      { id: "b", label: "Integers" },
      { id: "c", label: "Either -1 or +1" },
      { id: "d", label: "Complex" },
    ],
    "Singular values are √(eigenvalues of AᵀA) — and eigenvalues of positive semi-definite matrices are non-negative."),

  // S4
  q("S4", "truefalse",
    "The rank-k SVD approximation minimizes ||A - Aₖ||_F for any k.",
    [
      { id: "a", label: "True", correct: true },
      { id: "b", label: "False" },
    ],
    "Yes — the Eckart-Young theorem. The top-k singular value approximation is the best rank-k approximation in Frobenius norm."),

  // S5
  q("S5", "predict",
    "PageRank ranks pages by…",
    [
      { id: "a", label: "The dominant eigenvector of the link matrix", correct: true },
      { id: "b", label: "Number of words" },
      { id: "c", label: "Alphabetical order" },
      { id: "d", label: "Random choice" },
    ],
    "PageRank: pages are states, links are transitions, importance = dominant eigenvector of the link matrix. The eigenvector for eigenvalue 1."),
];

export const QUESTIONS_BY_CONCEPT: Record<string, Question[]> = QUESTIONS.reduce(
  (acc, q) => {
    if (!acc[q.conceptId]) acc[q.conceptId] = [];
    acc[q.conceptId].push(q);
    return acc;
  },
  {} as Record<string, Question[]>,
);

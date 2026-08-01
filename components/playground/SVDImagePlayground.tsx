"use client";
import { useState, useMemo, useEffect } from "react";
import { Slider } from "./Slider";

// Convert image to grayscale matrix
async function imageToMatrix(url: string, size: number = 64): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("no ctx");
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const M: number[][] = [];
      for (let y = 0; y < size; y++) {
        const row: number[] = [];
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          row.push((data[i] + data[i + 1] + data[i + 2]) / (3 * 255));
        }
        M.push(row);
      }
      resolve(M);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Generate a synthetic image (a face-like pattern)
function syntheticFace(size: number = 64): number[][] {
  const M: number[][] = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const cx = x - size / 2;
      const cy = y - size / 2;
      const r = Math.hypot(cx, cy) / (size / 2);
      // face circle
      let v = Math.max(0, 1 - r);
      // eyes
      const eyeL = Math.hypot(x - size * 0.35, y - size * 0.4);
      const eyeR = Math.hypot(x - size * 0.65, y - size * 0.4);
      if (eyeL < size * 0.05) v *= 0.2;
      if (eyeR < size * 0.05) v *= 0.2;
      // mouth
      const mouth = Math.hypot(x - size * 0.5, y - size * 0.7);
      if (mouth < size * 0.06 && y < size * 0.7) v *= 0.3;
      // gradient
      v *= 0.7 + 0.3 * (1 - r);
      row.push(Math.max(0, Math.min(1, v)));
    }
    M.push(row);
  }
  return M;
}

// SVD: A = U S V^T
function svd(A: number[][]): { U: number[][]; S: number[]; V: number[][] } {
  const m = A.length;
  const n = A[0].length;
  const k = Math.min(m, n);

  // Compute A^T A (n×n) and eigendecompose via Jacobi
  const AtA: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let p = 0; p < m; p++)
        AtA[i][j] += A[p][i] * A[p][j];

  const { values, vectors } = eigenJacobi(AtA, 200);
  const S = values.map((v) => Math.sqrt(Math.max(v, 0)));
  const V = vectors;

  // U = (1/sigma) A v_i
  const U: number[][] = [];
  for (let i = 0; i < k; i++) {
    const v = V.map((row) => row[i]);
    const u: number[] = new Array(m).fill(0);
    for (let p = 0; p < m; p++)
      for (let q = 0; q < n; q++)
        u[p] += A[p][q] * v[q];
    if (S[i] > 1e-9) for (let p = 0; p < m; p++) u[p] /= S[i];
    U.push(u);
  }
  return { U: transpose(U), S, V };
}

function transpose(M: number[][]): number[][] {
  const m = M.length, n = M[0].length;
  const T: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      T[j][i] = M[i][j];
  return T;
}

function eigenJacobi(M: number[][], iters: number): { values: number[]; vectors: number[][] } {
  const n = M.length;
  let A = M.map((r) => [...r]);
  let V = identity(n);
  for (let iter = 0; iter < iters; iter++) {
    let p = 0, q = 1, max = Math.abs(A[0][1]);
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (Math.abs(A[i][j]) > max) { max = Math.abs(A[i][j]); p = i; q = j; }
    if (max < 1e-12) break;
    const theta = A[p][p] === A[q][q] ? Math.PI / 4 : 0.5 * Math.atan2(2 * A[p][q], A[p][p] - A[q][q]);
    const c = Math.cos(theta), s = Math.sin(theta);
    const app = c * c * A[p][p] + 2 * c * s * A[p][q] + s * s * A[q][q];
    const aqq = s * s * A[p][p] - 2 * c * s * A[p][q] + c * c * A[q][q];
    A[p][p] = app; A[q][q] = aqq; A[p][q] = 0; A[q][p] = 0;
    for (let i = 0; i < n; i++) {
      if (i === p || i === q) continue;
      const aip = c * A[i][p] + s * A[i][q];
      const aiq = -s * A[i][p] + c * A[i][q];
      A[i][p] = aip; A[p][i] = aip;
      A[i][q] = aiq; A[q][i] = aiq;
    }
    for (let i = 0; i < n; i++) {
      const vip = c * V[i][p] + s * V[i][q];
      const viq = -s * V[i][p] + c * V[i][q];
      V[i][p] = vip; V[i][q] = viq;
    }
  }
  const values = A.map((r, i) => r[i]);
  const order = values.map((_, i) => i).sort((a, b) => values[b] - values[a]);
  return {
    values: order.map((i) => values[i]),
    vectors: order.map((i) => V.map((row) => row[i])),
  };
}

function identity(n: number): number[][] {
  const M: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) M[i][i] = 1;
  return M;
}

// Reconstruct A from top-k SVD
function reconstruct(U: number[][], S: number[], V: number[][], k: number): number[][] {
  const m = U.length;
  const n = V.length;
  const A: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let r = 0; r < k; r++) {
    const s = S[r];
    if (s < 1e-12) continue;
    for (let i = 0; i < m; i++)
      for (let j = 0; j < n; j++)
        A[i][j] += s * U[i][r] * V[j][r];
  }
  return A;
}

export function SVDImagePlayground() {
  const [M, setM] = useState<number[][] | null>(null);
  const [k, setK] = useState(5);
  const [decomp, setDecomp] = useState<{ U: number[][]; S: number[]; V: number[][] } | null>(null);
  const [size, setSize] = useState(48);

  useEffect(() => {
    // Use synthetic face
    const mat = syntheticFace(size);
    setM(mat);
    const t = setTimeout(() => {
      setDecomp(svd(mat));
    }, 50);
    return () => clearTimeout(t);
  }, [size]);

  const reconstructed = useMemo(() => {
    if (!decomp) return null;
    return reconstruct(decomp.U, decomp.S, decomp.V, k);
  }, [decomp, k]);

  const maxSV = decomp ? decomp.S[0] : 1;

  if (!M || !decomp) {
    return (
      <div className="bg-card border border-line rounded-xl p-8 text-center text-dim">
        Computing SVD…
      </div>
    );
  }

  return (
    <div className="bg-card border border-line rounded-xl p-4">
      <h3 className="text-sm font-medium text-ink mb-3">
        Compress a real image — keep the top <span className="text-singular">k</span> singular values
      </h3>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
        <div>
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Original (rank {decomp.S.filter((s) => s > 1e-3).length})</div>
          <ImageGrid M={M} />
        </div>
        <div>
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2">
            Reconstructed with k = <span className="text-singular">{k}</span>
          </div>
          <ImageGrid M={reconstructed!} />
        </div>
      </div>

      <div className="mt-4">
        <Slider
          label="k"
          value={k}
          min={1}
          max={Math.min(decomp.S.length, 40)}
          step={1}
          onChange={(v) => setK(Math.round(v))}
        />
        <div className="mt-3 text-[10px] text-faint uppercase tracking-wider mb-1">Singular values (sorted)</div>
        <div className="flex items-end gap-px h-12">
          {decomp.S.slice(0, 40).map((s, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${(s / maxSV) * 100}%`,
                background: i < k ? "var(--singular)" : "var(--ink-faint)",
                opacity: i < k ? 1 : 0.4,
              }}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-dim">
          Storage: <span className="text-ink font-mono">k × ({size} + {size}) = {k * size * 2}</span>
          {" "}vs original <span className="text-ink font-mono">{size} × {size} = {size * size}</span>
          {" "}(<span className="text-accent">{(100 * (k * size * 2) / (size * size)).toFixed(1)}%</span> of original)
        </div>
      </div>
    </div>
  );
}

function ImageGrid({ M }: { M: number[][] }) {
  const m = M.length, n = M[0].length;
  const cell = 4;
  return (
    <svg viewBox={`0 0 ${n} ${m}`} className="w-full max-w-[360px] bg-canvas border border-line rounded" style={{ imageRendering: "pixelated" }}>
      {M.map((row, y) =>
        row.map((v, x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={`rgb(${Math.round(v * 255)}, ${Math.round(v * 255)}, ${Math.round(v * 255)})`}
          />
        )),
      )}
    </svg>
  );
}

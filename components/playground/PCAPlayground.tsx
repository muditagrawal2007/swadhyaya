"use client";
import { useState, useMemo } from "react";
import { VectorCanvas } from "@/components/viz/VectorCanvas";

// 2x2 covariance eigen (PCA for 2D)
function pca2d(points: Array<[number, number]>): {
  mean: [number, number];
  pc1: { dir: [number, number]; variance: number };
  pc2: { dir: [number, number]; variance: number };
} {
  const n = points.length;
  const mean: [number, number] = [0, 0];
  for (const p of points) { mean[0] += p[0]; mean[1] += p[1]; }
  mean[0] /= n; mean[1] /= n;
  // cov matrix
  let c00 = 0, c01 = 0, c11 = 0;
  for (const p of points) {
    const dx = p[0] - mean[0], dy = p[1] - mean[1];
    c00 += dx * dx; c01 += dx * dy; c11 += dy * dy;
  }
  c00 /= n; c01 /= n; c11 /= n;
  // eigendecomp 2x2
  const tr = c00 + c11;
  const det = c00 * c11 - c01 * c01;
  const disc = Math.max(0, tr * tr - 4 * det);
  const sqrtD = Math.sqrt(disc);
  const l1 = (tr + sqrtD) / 2;
  const l2 = (tr - sqrtD) / 2;
  const eigvec = (lambda: number): [number, number] => {
    if (Math.abs(c01) > 1e-9) return normalize([-c01, c00 - lambda]);
    if (Math.abs(c01) > 1e-9 || Math.abs(c00 - lambda) > 1e-9)
      return normalize([c11 - lambda, -c01]);
    return [1, 0];
  };
  return {
    mean,
    pc1: { dir: eigvec(l1), variance: l1 },
    pc2: { dir: eigvec(l2), variance: l2 },
  };
}
function normalize(v: [number, number]): [number, number] {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
}

function generateDataset(kind: "blob" | "line" | "circle"): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  const N = 80;
  for (let i = 0; i < N; i++) {
    if (kind === "blob") {
      // diagonal blob
      const t = (i / N) * Math.PI * 2;
      const r = 1 + 0.5 * Math.cos(t * 3);
      points.push([r * Math.cos(t) * 2 + (Math.random() - 0.5) * 0.6, r * Math.sin(t) * 1.2 + (Math.random() - 0.5) * 0.6]);
    } else if (kind === "line") {
      const t = (Math.random() - 0.5) * 5;
      points.push([t * 1.5, t * 1 + (Math.random() - 0.5) * 0.3]);
    } else {
      const t = (i / N) * Math.PI * 2 + Math.random() * 0.05;
      points.push([Math.cos(t) * 3, Math.sin(t) * 3]);
    }
  }
  return points;
}

export function PCAPlayground() {
  const [kind, setKind] = useState<"blob" | "line" | "circle">("blob");
  const points = useMemo(() => generateDataset(kind), [kind]);
  const pca = useMemo(() => pca2d(points), [points]);

  return (
    <div className="bg-card border border-line rounded-xl p-4">
      <h3 className="text-sm font-medium text-ink mb-2">
        The best camera angle for your data — the direction of maximum spread
      </h3>
      <p className="text-xs text-dim mb-3">
        PCA finds the line through the data cloud that captures the most variance.
        Watch the purple (PC1) and gold (PC2) axes snap to the natural directions.
      </p>

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        <div className="bg-canvas border border-line rounded p-2">
          <VectorCanvas
            width={520}
            height={520}
            worldSize={6}
            arrows={[
              { from: { x: pca.mean[0], y: pca.mean[1] }, to: { x: pca.mean[0] + pca.pc1.dir[0] * 3, y: pca.mean[1] + pca.pc1.dir[1] * 3 }, color: "var(--eigen)", label: "PC1", width: 3, labelOffset: { x: 0, y: -0.3 } },
              { from: { x: pca.mean[0], y: pca.mean[1] }, to: { x: pca.mean[0] + pca.pc2.dir[0] * 3, y: pca.mean[1] + pca.pc2.dir[1] * 3 }, color: "var(--singular)", label: "PC2", width: 3, labelOffset: { x: 0, y: 0.3 } },
            ]}
          >
            {points.map((p, i) => (
              <circle
                key={i}
                cx={520 / 2 + p[0] * (520 / 12)}
                cy={520 / 2 - p[1] * (520 / 12)}
                r={3}
                fill="var(--transform)"
                opacity={0.7}
              />
            ))}
            <circle
              cx={520 / 2 + pca.mean[0] * (520 / 12)}
              cy={520 / 2 - pca.mean[1] * (520 / 12)}
              r={4}
              fill="var(--accent)"
            />
          </VectorCanvas>
        </div>

        <div className="space-y-3">
          <div className="bg-elev/30 border border-line rounded p-3">
            <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Dataset</div>
            <div className="flex flex-col gap-1.5 text-xs">
              {(["blob", "line", "circle"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`px-2 py-1.5 rounded text-left ${kind === k ? "bg-accent/20 text-accent border border-accent/40" : "bg-elev border border-line text-dim hover:text-ink"}`}
                >
                  {k === "blob" ? "Diagonal blob" : k === "line" ? "Noisy line" : "Circle"}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-elev/30 border border-eigen/30 rounded p-3">
            <div className="text-[10px] text-faint uppercase tracking-wider mb-1" style={{ color: "var(--eigen)" }}>PC1 variance</div>
            <div className="font-mono text-lg">{pca.pc1.variance.toFixed(3)}</div>
            <div className="text-[10px] text-faint mt-1">Direction of maximum spread</div>
          </div>
          <div className="bg-elev/30 border border-singular/40 rounded p-3">
            <div className="text-[10px] text-faint uppercase tracking-wider mb-1" style={{ color: "var(--singular)" }}>PC2 variance</div>
            <div className="font-mono text-lg">{pca.pc2.variance.toFixed(3)}</div>
            <div className="text-[10px] text-faint mt-1">Perpendicular to PC1</div>
          </div>
          <div className="bg-elev/30 border border-line rounded p-3 text-xs text-dim">
            <span className="text-ink">Variance ratio:</span> {((pca.pc1.variance / (pca.pc1.variance + pca.pc2.variance)) * 100).toFixed(1)}% explained by PC1
          </div>
        </div>
      </div>
    </div>
  );
}

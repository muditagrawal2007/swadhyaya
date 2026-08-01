"use client";
import { useState, useMemo } from "react";
import { VectorCanvas } from "@/components/viz/VectorCanvas";
import { Slider } from "./Slider";
import { m2, m2eigen, fmt } from "@/lib/math";

export function SVDPlayground() {
  const [a, setA] = useState(1.5);
  const [b, setB] = useState(0.8);
  const [c, setC] = useState(-0.5);
  const [d, setD] = useState(1.2);
  const M = useMemo(() => {
    const mat: number[][] = [[a, b], [c, d]];
    return mat;
  }, [a, b, c, d]);

  // SVD via eigen of M^T M
  const MtM = useMemo(() => {
    const Mt: number[][] = [[a, c], [b, d]];
    return [
      [Mt[0][0] * M[0][0] + Mt[0][1] * M[1][0], Mt[0][0] * M[0][1] + Mt[0][1] * M[1][1]],
      [Mt[1][0] * M[0][0] + Mt[1][1] * M[1][0], Mt[1][0] * M[0][1] + Mt[1][1] * M[1][1]],
    ];
  }, [a, b, c, d, M]);

  const e = useMemo(() => m2eigen(MtM as any), [MtM]);
  const singularValues = e ? [Math.sqrt(Math.max(e.values[0], 0)), Math.sqrt(Math.max(e.values[1], 0))] : [0, 0];
  const V: number[][] = e ? e.vectors.map((row) => [row[0], row[1]]) as any : [[1, 0], [0, 1]];

  // U columns: (1/σ) M v_i
  const U = useMemo(() => {
    if (!e) return [[1, 0], [0, 1]];
    const out: number[][] = [];
    for (let i = 0; i < 2; i++) {
      const v = [V[0][i], V[1][i]];
      const u = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
      if (singularValues[i] > 1e-9) {
        u[0] /= singularValues[i];
        u[1] /= singularValues[i];
      }
      out.push(u);
    }
    return out;
  }, [e, V, M, singularValues]);

  return (
    <div className="bg-card border border-line rounded-xl p-4">
      <h3 className="text-sm font-medium text-ink mb-3">
        Every matrix is <span className="text-eigen">Vᵀ</span> · <span className="text-singular">Σ</span> · <span className="text-transform">U</span>
      </h3>
      <p className="text-xs text-dim mb-4">
        Vᵀ rotates the input. Σ stretches along new axes. U rotates again. The composite
        is your matrix. Drag the matrix entries — the decomposition recomputes live.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <VectorCanvas
          width={520}
          height={520}
          worldSize={6}
          arrows={[
            { from: { x: 0, y: 0 }, to: { x: a, y: c }, color: "var(--vector)", label: "col 1", width: 2.5, labelOffset: { x: 0, y: -0.3 } },
            { from: { x: 0, y: 0 }, to: { x: b, y: d }, color: "var(--matrix)", label: "col 2", width: 2.5, labelOffset: { x: 0, y: 0.3 } },
            { from: { x: 0, y: 0 }, to: { x: V[0][0] * 2, y: V[1][0] * 2 }, color: "var(--eigen)", label: "v₁", width: 2, dashed: true },
            { from: { x: 0, y: 0 }, to: { x: V[0][1] * 2, y: V[1][1] * 2 }, color: "var(--eigen)", label: "v₂", width: 2, dashed: true },
            { from: { x: 0, y: 0 }, to: { x: U[0][0] * 2, y: U[1][0] * 2 }, color: "var(--transform)", label: "u₁", width: 2, dashed: true },
            { from: { x: 0, y: 0 }, to: { x: U[0][1] * 2, y: U[1][1] * 2 }, color: "var(--transform)", label: "u₂", width: 2, dashed: true },
          ]}
        />

        <div className="space-y-3">
          <div className="bg-elev/30 border border-line rounded-md p-3">
            <div className="text-[10px] text-faint uppercase tracking-wider mb-2">A = </div>
            <div className="font-mono text-sm text-ink">
              [{fmt(a, 2)}  {fmt(b, 2)}]<br />
              [{fmt(c, 2)}  {fmt(d, 2)}]
            </div>
          </div>

          <div className="bg-elev/30 border border-eigen/30 rounded-md p-3">
            <div className="text-[10px] text-faint uppercase tracking-wider mb-2" style={{ color: "var(--eigen)" }}>Vᵀ (rotation in input space)</div>
            <div className="font-mono text-sm">
              [{fmt(V[0][0], 2)}  {fmt(V[0][1], 2)}]<br />
              [{fmt(V[1][0], 2)}  {fmt(V[1][1], 2)}]
            </div>
          </div>

          <div className="bg-elev/30 border border-singular/40 rounded-md p-3">
            <div className="text-[10px] text-faint uppercase tracking-wider mb-2" style={{ color: "var(--singular)" }}>Σ (stretching)</div>
            <div className="font-mono text-sm">
              [{fmt(singularValues[0], 2)}  0]<br />
              [0  {fmt(singularValues[1], 2)}]
            </div>
            <div className="text-[10px] text-faint mt-1">
              singular values = how much each direction is stretched
            </div>
          </div>

          <div className="bg-elev/30 border border-transform/30 rounded-md p-3">
            <div className="text-[10px] text-faint uppercase tracking-wider mb-2" style={{ color: "var(--transform)" }}>U (rotation in output space)</div>
            <div className="font-mono text-sm">
              [{fmt(U[0][0], 2)}  {fmt(U[0][1], 2)}]<br />
              [{fmt(U[1][0], 2)}  {fmt(U[1][1], 2)}]
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-elev/30 border border-line rounded-md p-3">
        <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Matrix entries</div>
        <div className="grid grid-cols-2 gap-x-3">
          <Slider label="a" value={a} min={-3} max={3} step={0.1} onChange={setA} />
          <Slider label="b" value={b} min={-3} max={3} step={0.1} onChange={setB} />
          <Slider label="c" value={c} min={-3} max={3} step={0.1} onChange={setC} />
          <Slider label="d" value={d} min={-3} max={3} step={0.1} onChange={setD} />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { VectorCanvas } from "@/components/viz/VectorCanvas";
import { Slider } from "./Slider";
import { m2eigen, m2det, fmt } from "@/lib/math";
import { Sparkles, RotateCcw } from "lucide-react";

// Concept E1: Eigenvectors are the special vectors that don't change direction.
// Drag the test vector — when it lands on an eigenvector, the system celebrates.

export function EigenDiscoverPlayground() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const [d, setD] = useState(2);

  const M = useMemo(() => [[a, b], [c, d]], [a, b, c, d]);
  const det = m2det(M as any);
  const eigen = useMemo(() => m2eigen(M as any), [M]);
  const tr = a + d;
  // λ = (tr ± sqrt(tr²-4·det)) / 2
  const disc = tr * tr - 4 * det;

  // The student's test vector and what it maps to
  const [tx, setTx] = useState(2);
  const [ty, setTy] = useState(1);
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);

  // Apply M to the test vector
  const outX = a * tx + b * ty;
  const outY = c * tx + d * ty;

  // Eigenvector 1: scaled to length √(value) for visual clarity
  const ev1 = eigen && disc >= 0 ? {
    x: eigen.vectors[0][0] * Math.min(3, Math.abs(eigen.values[0])),
    y: eigen.vectors[0][1] * Math.min(3, Math.abs(eigen.values[0])),
  } : { x: 0, y: 0 };
  const ev2 = eigen && disc >= 0 ? {
    x: eigen.vectors[1][0] * Math.min(3, Math.abs(eigen.values[1])),
    y: eigen.vectors[1][1] * Math.min(3, Math.abs(eigen.values[1])),
  } : { x: 0, y: 0 };

  // Is the test vector collinear with an eigenvector?
  // (i.e., does it survive the transformation up to a scalar?)
  const cross1 = tx * ev1.y - ty * ev1.x;
  const cross2 = tx * ev2.y - ty * ev2.x;
  const onEigen1 = Math.abs(cross1) < 0.05 && (Math.abs(tx) + Math.abs(ty)) > 0.1;
  const onEigen2 = Math.abs(cross2) < 0.05 && (Math.abs(tx) + Math.abs(ty)) > 0.1;
  const foundEigenvector = onEigen1 || onEigen2;
  const foundLambda: number | null = eigen
    ? (onEigen1 ? eigen.values[0] : onEigen2 ? eigen.values[1] : null)
    : null;

  // Animated trail
  useEffect(() => {
    setTrail([{ x: tx, y: ty }]);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => {
        if (prev.length === 0) return [{ x: tx, y: ty }];
        const last = prev[prev.length - 1];
        const nx = a * last.x + b * last.y;
        const ny = c * last.x + d * last.y;
        const next = [...prev, { x: nx, y: ny }];
        if (next.length > 25) next.shift();
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [a, b, c, d, tx, ty]);

  // Presets
  const presets = [
    { name: "Symmetric", a: 2, b: 1, c: 1, d: 2 },
    { name: "Shear", a: 1, b: 1, c: 0, d: 1 },
    { name: "Scale", a: 2, b: 0, c: 0, d: 0.5 },
    { name: "Identity", a: 1, b: 0, c: 0, d: 1 },
    { name: "Rotation (no real eigen)", a: 0, b: -1, c: 1, d: 0 },
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4">
      <div className="bg-card border border-line rounded-xl p-4">
        <h3 className="text-sm font-medium text-ink mb-2">
          Find the vector that just gets stretched, not rotated
        </h3>
        <VectorCanvas
          width={520}
          height={520}
          worldSize={5}
          arrows={[
            { from: { x: 0, y: 0 }, to: { x: a, y: c }, color: "var(--vector)", label: "col 1", width: 2.5, labelOffset: { x: 0, y: -0.3 } },
            { from: { x: 0, y: 0 }, to: { x: b, y: d }, color: "var(--matrix)", label: "col 2", width: 2.5, labelOffset: { x: 0, y: 0.3 } },
            // Eigenvector overlays (only if real)
            ...(eigen && disc >= 0 && Math.abs(eigen.vectors[0][0]) + Math.abs(eigen.vectors[0][1]) > 0.01 ? [
              { from: { x: 0, y: 0 }, to: ev1, color: "var(--eigen)", label: `eigenvector 1 (λ=${fmt(eigen.values[0], 2)})`, width: 2.5, dashed: true, labelOffset: { x: 0, y: -0.4 } },
              { from: { x: 0, y: 0 }, to: { x: -ev1.x, y: -ev1.y }, color: "var(--eigen)", width: 2, dashed: true },
              { from: { x: 0, y: 0 }, to: ev2, color: "var(--singular)", label: `λ₂=${fmt(eigen.values[1], 2)}`, width: 2.5, dashed: true, labelOffset: { x: 0, y: 0.4 } },
              { from: { x: 0, y: 0 }, to: { x: -ev2.x, y: -ev2.y }, color: "var(--singular)", width: 2, dashed: true },
            ] : []),
            // The test vector and what it maps to
            { from: { x: 0, y: 0 }, to: { x: tx, y: ty }, color: foundEigenvector ? "var(--accent)" : "var(--ink)", label: foundEigenvector ? "✓ v" : "v", width: 3, labelOffset: { x: 0.3, y: 0.3 } },
            { from: { x: 0, y: 0 }, to: { x: outX, y: outY }, color: foundEigenvector ? "var(--accent)" : "var(--warn)", label: foundEigenvector ? `= ${fmt(foundLambda ?? 0, 2)}·v` : "Mv", width: 3, dashed: !foundEigenvector, labelOffset: { x: 0.3, y: -0.3 } },
          ]}
        >
          {trail.length > 1 && (
            <polyline
              points={trail.map((p) => `${520/2 + p.x * (520/10)},${520/2 - p.y * (520/10)}`).join(" ")}
              fill="none"
              stroke="var(--transform)"
              strokeWidth={1}
              strokeDasharray="3 4"
              opacity={0.4}
            />
          )}
        </VectorCanvas>
      </div>

      <div className="space-y-3">
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Matrix A</div>
          <Slider label="a" value={a} min={-2} max={2} step={0.1} onChange={setA} />
          <Slider label="b" value={b} min={-2} max={2} step={0.1} onChange={setB} />
          <Slider label="c" value={c} min={-2} max={2} step={0.1} onChange={setC} />
          <Slider label="d" value={d} min={-2} max={2} step={0.1} onChange={setD} />
        </div>

        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Test vector v (drag to discover)</div>
          <Slider label="x" value={tx} min={-4} max={4} step={0.05} onChange={setTx} />
          <Slider label="y" value={ty} min={-4} max={4} step={0.05} onChange={setTy} />
        </div>

        <div className={`rounded-xl p-3 text-xs leading-relaxed ${
          foundEigenvector
            ? "bg-accent/10 border border-accent/30 text-accent"
            : "bg-elev/40 border border-line text-dim"
        }`}>
          {foundEigenvector ? (
            <>
              <div className="font-medium flex items-center gap-1 mb-1">
                <Sparkles size={12} /> You found an eigenvector!
              </div>
              <div>Av = {fmt(foundLambda ?? 0, 3)} · v. The vector v just got stretched by {fmt(foundLambda ?? 0, 2)}× — same direction, new length.</div>
            </>
          ) : disc < 0 ? (
            <div>No real eigenvectors — this matrix is a rotation (or rotation+scaling). The trajectory spirals forever.</div>
          ) : (
            <div>Drag v. Watch the dashed red Mv arrow — is it collinear with v? If yes, v is an eigenvector. The dashed purple/gold lines show the special directions.</div>
          )}
        </div>

        <div className="text-[10px] text-faint">presets:</div>
        <div className="grid grid-cols-2 gap-1">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => { setA(p.a); setB(p.b); setC(p.c); setD(p.d); }}
              className="text-[10px] px-1 py-1 border border-line rounded hover:bg-elev/60 text-dim hover:text-ink"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

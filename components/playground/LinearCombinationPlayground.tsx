"use client";
import { useState, useMemo } from "react";
import { VectorCanvas } from "@/components/viz/VectorCanvas";
import { Slider } from "./Slider";

// Concept V2: Adding and Scaling — Linear Combinations
// "Head-to-tail walk. Stretch, shrink, flip. The two operations that build ALL of linear algebra."

export function LinearCombinationPlayground() {
  const [a, setA] = useState({ x: 2, y: 1 });
  const [b, setB] = useState({ x: -1, y: 2 });
  const [ca, setCa] = useState(1.5);
  const [cb, setCb] = useState(0.7);

  const sum = useMemo(() => ({
    x: ca * a.x + cb * b.x,
    y: ca * a.y + cb * b.y,
  }), [ca, cb, a, b]);

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="bg-card border border-line rounded-xl p-4">
        <h3 className="text-sm font-medium text-ink mb-2">
          Head-to-tail walk — the sum vector
        </h3>
        <VectorCanvas
          width={520}
          height={520}
          worldSize={5}
          arrows={[
            { from: { x: 0, y: 0 }, to: a, color: "var(--vector)", label: "a", width: 3, labelOffset: { x: 0, y: -0.3 } },
            { from: { x: 0, y: 0 }, to: b, color: "var(--matrix)", label: "b", width: 3, labelOffset: { x: 0, y: 0.3 } },
            // The c·a vector alone
            { from: { x: 0, y: 0 }, to: { x: ca * a.x, y: ca * a.y }, color: "var(--vector)", label: `${ca.toFixed(1)}·a`, width: 2, dashed: true, labelOffset: { x: 0, y: -0.4 } },
            // The c·b vector head-to-tail from c·a
            { from: { x: ca * a.x, y: ca * a.y }, to: sum, color: "var(--matrix)", label: `${cb.toFixed(1)}·b`, width: 2, dashed: true, labelOffset: { x: 0.3, y: 0.3 } },
            // The result
            { from: { x: 0, y: 0 }, to: sum, color: "var(--accent)", label: `${ca.toFixed(1)}a+${cb.toFixed(1)}b`, width: 3, labelOffset: { x: 0.2, y: -0.4 } },
          ]}
        />
      </div>
      <div className="space-y-3">
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2" style={{ color: "var(--vector)" }}>Vector a</div>
          <Slider label="x" value={a.x} min={-4} max={4} step={0.1} onChange={(x) => setA({ x, y: a.y })} />
          <Slider label="y" value={a.y} min={-4} max={4} step={0.1} onChange={(y) => setA({ x: a.x, y })} />
        </div>
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2" style={{ color: "var(--matrix)" }}>Vector b</div>
          <Slider label="x" value={b.x} min={-4} max={4} step={0.1} onChange={(x) => setB({ x, y: b.y })} />
          <Slider label="y" value={b.y} min={-4} max={4} step={0.1} onChange={(y) => setB({ x: b.x, y })} />
        </div>
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Scalars c₁, c₂</div>
          <Slider label="c₁" value={ca} min={-2} max={2} step={0.1} onChange={setCa} />
          <Slider label="c₂" value={cb} min={-2} max={2} step={0.1} onChange={setCb} />
        </div>
        <div className="bg-accent/10 border border-accent/30 rounded p-3 text-xs">
          <div className="text-accent font-medium mb-1">c₁·a + c₂·b =</div>
          <div className="font-mono text-lg text-center">({sum.x.toFixed(2)}, {sum.y.toFixed(2)})</div>
        </div>
        <div className="text-[10px] text-dim leading-relaxed">
          Adding vectors: head-to-tail. Walk along c₁·a, then c₁·a + c₂·b. The result is the new arrow from the origin. The two dashed arrows are the steps; the orange arrow is the final sum.
        </div>
      </div>
    </div>
  );
}

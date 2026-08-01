"use client";
import { useState } from "react";
import { VectorCanvas } from "@/components/viz/VectorCanvas";
import { Slider } from "./Slider";

export function VectorArrowPlayground() {
  const [v, setV] = useState({ x: 3, y: 2 });
  const [tailX, setTailX] = useState(0);
  const [tailY, setTailY] = useState(0);

  const length = Math.hypot(v.x, v.y);
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="bg-card border border-line rounded-xl p-4">
        <h3 className="text-sm font-medium text-ink mb-2">
          A vector is an arrow — slide its head and tail independently
        </h3>
        <VectorCanvas
          width={520}
          height={520}
          worldSize={8}
          arrows={[
            { from: { x: tailX, y: tailY }, to: { x: tailX + v.x, y: tailY + v.y }, color: "var(--vector)", label: "v", labelOffset: { x: 0, y: -0.5 }, width: 3 },
            { from: { x: 0, y: 0 }, to: v, color: "var(--transform)", label: "(same)", dashed: true, labelOffset: { x: 0, y: 0.4 } },
          ]}
        />
      </div>
      <div className="space-y-3">
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Head (relative to tail)</div>
          <Slider label="x" value={v.x} min={-7} max={7} step={0.1} onChange={(x) => setV({ x, y: v.y })} />
          <Slider label="y" value={v.y} min={-7} max={7} step={0.1} onChange={(y) => setV({ x: v.x, y })} />
        </div>
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2">Tail position</div>
          <Slider label="x" value={tailX} min={-5} max={5} step={0.1} onChange={setTailX} />
          <Slider label="y" value={tailY} min={-5} max={5} step={0.1} onChange={setTailY} />
        </div>
        <div className="bg-elev/40 border border-line rounded-xl p-3 text-xs text-dim leading-relaxed">
          The arrow (red) slides with the tail. But the dashed grey arrow — same
          head-to-tail difference — is the same vector. <span className="text-ink">The vector is the difference, not the position.</span>
        </div>
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider">Length</div>
          <div className="font-mono text-2xl text-ink mt-1">{length.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
}

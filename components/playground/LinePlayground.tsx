"use client";
import { useState, useMemo } from "react";
import { VectorCanvas } from "@/components/viz/VectorCanvas";
import { Slider } from "./Slider";

export function LinePlayground() {
  // y = m*x + c
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);
  const [show2, setShow2] = useState(true);
  const [m2, setM2] = useState(-1);
  const [c2, setC2] = useState(3);

  // line as world coords
  const line1 = useMemo(() => [
    { x: -10, y: m * -10 + c },
    { x: 10, y: m * 10 + c },
  ], [m, c]);
  const line2 = useMemo(() => [
    { x: -10, y: m2 * -10 + c2 },
    { x: 10, y: m2 * 10 + c2 },
  ], [m2, c2]);

  // intersection of two lines
  const intersect = useMemo(() => {
    const det = m - m2;
    if (Math.abs(det) < 1e-6) return null; // parallel
    const x = (c2 - c) / det;
    const y = m * x + c;
    return { x, y };
  }, [m, c, m2, c2]);

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="bg-card border border-line rounded-xl p-4">
        <h3 className="text-sm font-medium text-ink mb-2">
          Two lines — where do they meet?
        </h3>
        <VectorCanvas
          width={520}
          height={520}
          worldSize={8}
          arrows={intersect ? [{ from: { x: 0, y: 0 }, to: intersect, color: "var(--accent)", label: `(${intersect.x.toFixed(2)}, ${intersect.y.toFixed(2)})`, labelOffset: { x: 0, y: -0.5 }, width: 3 }] : []}
          gridLines={[
            { from: line1[0], to: line1[1], color: "var(--vector)", width: 2.5 },
            ...(show2 ? [{ from: line2[0], to: line2[1], color: "var(--matrix)", width: 2.5 }] : []),
          ]}
        />
      </div>
      <div className="space-y-3">
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="text-[10px] text-faint uppercase tracking-wider mb-2" style={{ color: "var(--vector)" }}>Line 1</div>
          <div className="font-mono text-lg text-vector mb-2">y = {m.toFixed(2)}x + {c.toFixed(2)}</div>
          <Slider label="m" value={m} min={-3} max={3} step={0.05} onChange={setM} />
          <Slider label="c" value={c} min={-5} max={5} step={0.1} onChange={setC} />
        </div>
        <div className="bg-card border border-line rounded-xl p-4">
          <label className="flex items-center gap-2 text-xs text-dim mb-2">
            <input type="checkbox" checked={show2} onChange={(e) => setShow2(e.target.checked)} />
            Show line 2
          </label>
          {show2 && (
            <>
              <div className="text-[10px] text-faint uppercase tracking-wider mb-2" style={{ color: "var(--matrix)" }}>Line 2</div>
              <div className="font-mono text-lg text-matrix mb-2">y = {m2.toFixed(2)}x + {c2.toFixed(2)}</div>
              <Slider label="m" value={m2} min={-3} max={3} step={0.05} onChange={setM2} />
              <Slider label="c" value={c2} min={-5} max={5} step={0.1} onChange={setC2} />
            </>
          )}
        </div>
        {intersect ? (
          <div className="bg-elev/40 border border-line rounded-xl p-3">
            <div className="text-xs text-accent font-medium">They meet at:</div>
            <div className="font-mono text-lg text-ink mt-1">
              ({intersect.x.toFixed(3)}, {intersect.y.toFixed(3)})
            </div>
          </div>
        ) : show2 ? (
          <div className="bg-elev/40 border border-warn/40 rounded-xl p-3">
            <div className="text-xs text-warn font-medium">Parallel — no meeting</div>
            <div className="text-xs text-dim mt-1">Both lines have the same slope.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

"use client";
import { useState, useMemo } from "react";
import { VectorCanvas } from "@/components/viz/VectorCanvas";
import { Slider } from "./Slider";

// Concept: L1 → L2 → L3 (intersection of 2 lines, 3 lines, 2 lines + 1 different)
// "An equation is a question. A system is a conversation between equations."

interface Line {
  m: number;
  c: number;
  label: string;
  color: string;
}

export function IntersectPlayground() {
  const [m1, setM1] = useState(1);
  const [c1, setC1] = useState(0);
  const [m2, setM2] = useState(-1);
  const [c2, setC2] = useState(2);
  const [m3, setM3] = useState(0.5);
  const [c3, setC3] = useState(-1);
  const [show3, setShow3] = useState(false);

  const lines: Line[] = [
    { m: m1, c: c1, label: "L1", color: "var(--vector)" },
    { m: m2, c: c2, label: "L2", color: "var(--matrix)" },
  ];
  if (show3) lines.push({ m: m3, c: c3, label: "L3", color: "var(--transform)" });

  // pairwise intersections
  const intersects = useMemo(() => {
    const out: Array<{ x: number; y: number; labels: string; color: string } | null> = [];
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const a = lines[i], b = lines[j];
        const det = a.m - b.m;
        if (Math.abs(det) < 1e-6) {
          out.push(null);
          continue;
        }
        const x = (b.c - a.c) / det;
        const y = a.m * x + a.c;
        out.push({ x, y, labels: `${a.label}∩${b.label}`, color: "var(--accent)" });
      }
    }
    return out;
  }, [m1, c1, m2, c2, m3, c3, show3]);

  // For L3 only: 3 lines meeting
  const triple = useMemo(() => {
    if (!show3) return null;
    const det = (m1 - m2) * (m2 - m3) * (m1 - m3);
    if (Math.abs(det) < 1e-6) return null;
    // Solve via Cramer's rule
    const a = [
      [m1, -1, c1],
      [m2, -1, c2],
      [m3, -1, c3],
    ];
    // y - m*x = c → m*x - y = -c
    // Hmm, the form is y = mx + c so  -m*x + y = c
    const A = [
      [-m1, 1, c1],
      [-m2, 1, c2],
      [-m3, 1, c3],
    ];
    const detA = A[0][0]*(A[1][1]*A[2][2]-A[1][2]*A[2][1]) - A[0][1]*(A[1][0]*A[2][2]-A[1][2]*A[2][0]) + A[0][2]*(A[1][0]*A[2][1]-A[1][1]*A[2][0]);
    if (Math.abs(detA) < 1e-6) return null;
    const Ax = [
      [c1, 1, c1],
      [c2, 1, c2],
      [c3, 1, c3],
    ];
    const detAx = Ax[0][0]*(Ax[1][1]*Ax[2][2]-Ax[1][2]*Ax[2][1]) - Ax[0][1]*(Ax[1][0]*Ax[2][2]-Ax[1][2]*Ax[2][0]) + Ax[0][2]*(Ax[1][0]*Ax[2][1]-Ax[1][1]*Ax[2][0]);
    const Ay = [
      [-m1, c1, c1],
      [-m2, c2, c2],
      [-m3, c3, c3],
    ];
    const detAy = Ay[0][0]*(Ay[1][1]*Ay[2][2]-Ay[1][2]*Ay[2][1]) - Ay[0][1]*(Ay[1][0]*Ay[2][2]-Ay[1][2]*Ay[2][0]) + Ay[0][2]*(Ay[1][0]*Ay[2][1]-Ay[1][1]*Ay[2][0]);
    return { x: detAx / detA, y: detAy / detA };
  }, [show3, m1, c1, m2, c2, m3, c3]);

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="bg-card border border-line rounded-xl p-4">
        <h3 className="text-sm font-medium text-ink mb-2">
          Drag the line controls — where do they all meet?
        </h3>
        <VectorCanvas
          width={520}
          height={520}
          worldSize={6}
          gridLines={lines.map((l) => ({
            from: { x: -6, y: l.m * -6 + l.c },
            to: { x: 6, y: l.m * 6 + l.c },
            color: l.color,
            width: 2.5,
          }))}
          arrows={[
            ...(triple
              ? [{ from: { x: 0, y: 0 }, to: triple, color: "var(--accent)", label: `(${triple.x.toFixed(2)}, ${triple.y.toFixed(2)})`, width: 3, labelOffset: { x: 0, y: -0.4 } }]
              : intersects.filter(Boolean).map((p, i) => ({
                  from: { x: 0, y: 0 },
                  to: p!,
                  color: p!.color,
                  label: p!.labels,
                  width: 2.5,
                  labelOffset: { x: 0, y: -0.3 - i * 0.3 },
                }))),
          ]}
        />
      </div>
      <div className="space-y-3">
        {lines.map((l, i) => (
          <div key={i} className="bg-card border border-line rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: l.color }}>
              {l.label}: y = {l.m.toFixed(2)}x + {l.c.toFixed(2)}
            </div>
            <Slider label="m" value={l.m} min={-3} max={3} step={0.05} onChange={(v) => {
              if (i === 0) setM1(v); else if (i === 1) setM2(v); else setM3(v);
            }} />
            <Slider label="c" value={l.c} min={-4} max={4} step={0.1} onChange={(v) => {
              if (i === 0) setC1(v); else if (i === 1) setC2(v); else setC3(v);
            }} />
          </div>
        ))}
        {lines.length < 3 && (
          <button
            onClick={() => setShow3(true)}
            className="w-full text-xs text-dim hover:text-ink border border-dashed border-line rounded-xl py-2 hover:bg-elev/40 transition"
          >
            + Add a third line
          </button>
        )}

        {intersects.includes(null) && (
          <div className="bg-warn/10 border border-warn/30 rounded-xl p-3 text-xs text-warn">
            Two lines are parallel — they never meet.
          </div>
        )}
        {show3 && !triple && !intersects.includes(null) && (
          <div className="bg-warn/10 border border-warn/30 rounded-xl p-3 text-xs text-warn">
            The three lines don't all meet at one point — no triple intersection.
          </div>
        )}
      </div>
    </div>
  );
}

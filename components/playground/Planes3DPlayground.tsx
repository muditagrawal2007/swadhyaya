"use client";
import { useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Line, Text } from "@react-three/drei";
import { matRref } from "@/lib/math";
import { Slider } from "./Slider";
import { cn } from "@/lib/cn";
import { Sparkles, AlertTriangle, Infinity as InfIcon } from "lucide-react";

// Concept L3: Three equations in three unknowns.
// "Three planes meeting at a point — or not. The 3D upgrade of L2."

type PresetId =
  | "single-point"
  | "no-solution"
  | "line-of-solutions"
  | "all-coincident"
  | "custom";

interface Preset {
  id: PresetId;
  label: string;
  blurb: string;
  coeffs: [number, number, number, number][];
}

const PRESETS: Preset[] = [
  {
    id: "single-point",
    label: "Meet at one point",
    blurb:
      "Three independent planes that intersect at a single (x, y, z). Unique solution.",
    coeffs: [
      [1, 0, 0, 2],
      [0, 1, 0, 1],
      [0, 0, 1, 3],
    ],
  },
  {
    id: "no-solution",
    label: "No common point",
    blurb:
      "Two planes are parallel, the third cuts across — no triple (x, y, z) satisfies all three.",
    coeffs: [
      [1, 0, 0, 2],
      [1, 0, 0, 5],
      [0, 1, 0, 1],
    ],
  },
  {
    id: "line-of-solutions",
    label: "A whole line",
    blurb:
      "Two planes are parallel, third is parallel to both — they share an entire line of points.",
    coeffs: [
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [0, 1, 0, 2],
    ],
  },
  {
    id: "all-coincident",
    label: "All the same plane",
    blurb:
      "All three equations describe the exact same plane — infinitely many (x, y, z) lie on it.",
    coeffs: [
      [1, 0, 0, 1],
      [2, 0, 0, 2],
      [3, 0, 0, 3],
    ],
  },
];

function PlaneMesh({
  normal,
  d,
  color,
  opacity = 0.3,
  label,
  visible = true,
}: {
  normal: [number, number, number];
  d: number;
  color: string;
  opacity?: number;
  label?: string;
  visible?: boolean;
}) {
  const nLen = Math.hypot(normal[0], normal[1], normal[2]);
  if (nLen < 0.01 || !visible) return null;
  const n: [number, number, number] = [
    normal[0] / nLen,
    normal[1] / nLen,
    normal[2] / nLen,
  ];
  const center: [number, number, number] = [n[0] * d, n[1] * d, n[2] * d];

  let u: [number, number, number];
  if (Math.abs(n[2]) < 0.9) {
    u = [n[1], -n[0], 0];
  } else {
    u = [n[2], 0, -n[0]];
  }
  const uLen = Math.hypot(u[0], u[1], u[2]);
  u = [u[0] / uLen, u[1] / uLen, u[2] / uLen];
  const v: [number, number, number] = [
    n[1] * u[2] - n[2] * u[1],
    n[2] * u[0] - n[0] * u[2],
    n[0] * u[1] - n[1] * u[0],
  ];

  const S = 5;
  const corners: [number, number, number][] = [
    [
      center[0] - S * u[0] - S * v[0],
      center[1] - S * u[1] - S * v[1],
      center[2] - S * u[2] - S * v[2],
    ],
    [
      center[0] + S * u[0] - S * v[0],
      center[1] + S * u[1] - S * v[1],
      center[2] + S * u[2] - S * v[2],
    ],
    [
      center[0] + S * u[0] + S * v[0],
      center[1] + S * u[1] + S * v[1],
      center[2] + S * u[2] + S * v[2],
    ],
    [
      center[0] - S * u[0] + S * v[0],
      center[1] - S * u[1] + S * v[1],
      center[2] - S * u[2] + S * v[2],
    ],
  ];

  return (
    <group>
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(corners.flat()), 3]}
          />
          <bufferAttribute
            attach="attributes-normal"
            args={[new Float32Array(corners.flat()), 3]}
          />
          <bufferAttribute
            attach="attributes-index"
            args={[new Uint16Array([0, 1, 2, 0, 2, 3]), 1]}
          />
        </bufferGeometry>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {label && (
        <Text
          position={[center[0] * 1.15, center[1] * 1.15, center[2] * 1.15]}
          fontSize={0.22}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

function EquationDisplay({
  rows,
  highlight,
}: {
  rows: [number, number, number, number][];
  highlight?: "none" | "infinite" | "unique";
}) {
  const fmt = (v: number) => {
    if (Math.abs(v) < 1e-6) return "0";
    const rounded = Math.round(v * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded}` : `${rounded.toFixed(1)}`;
  };
  return (
    <div className="bg-card border border-line rounded-xl p-3 font-mono text-xs leading-relaxed">
      {rows.map((r, i) => {
        const [a, b, c, d] = r;
        const terms: string[] = [];
        if (a !== 0) terms.push(`${fmt(a)}x`);
        if (b !== 0) terms.push(`${b > 0 && terms.length ? "+" : ""}${fmt(b)}y`);
        if (c !== 0) terms.push(`${c > 0 && terms.length ? "+" : ""}${fmt(c)}z`);
        const lhs = terms.length ? terms.join(" ") : "0";
        const colorClass =
          i === 0
            ? "text-[#e8864a]"
            : i === 1
              ? "text-[#6db3ff]"
              : "text-[#4dd9a8]";
        return (
          <div key={i} className={cn("flex items-center gap-1", colorClass)}>
            <span className="text-faint mr-2 w-4 text-right">
              {i + 1}.
            </span>
            <span>{lhs}</span>
            <span className="text-faint">=</span>
            <span>{fmt(d)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Planes3DPlayground() {
  const [presetId, setPresetId] = useState<PresetId>("single-point");
  const initial = PRESETS[0].coeffs;
  const [a1, setA1] = useState(initial[0][0]);
  const [b1, setB1] = useState(initial[0][1]);
  const [c1, setC1] = useState(initial[0][2]);
  const [d1, setD1] = useState(initial[0][3]);
  const [a2, setA2] = useState(initial[1][0]);
  const [b2, setB2] = useState(initial[1][1]);
  const [c2, setC2] = useState(initial[1][2]);
  const [d2, setD2] = useState(initial[1][3]);
  const [a3, setA3] = useState(initial[2][0]);
  const [b3, setB3] = useState(initial[2][1]);
  const [c3, setC3] = useState(initial[2][2]);
  const [d3, setD3] = useState(initial[2][3]);

  const applyPreset = (id: PresetId) => {
    setPresetId(id);
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    const c = p.coeffs;
    setA1(c[0][0]);
    setB1(c[0][1]);
    setC1(c[0][2]);
    setD1(c[0][3]);
    setA2(c[1][0]);
    setB2(c[1][1]);
    setC2(c[1][2]);
    setD2(c[1][3]);
    setA3(c[2][0]);
    setB3(c[2][1]);
    setC3(c[2][2]);
    setD3(c[2][3]);
  };

  const onSliderChange = () => setPresetId("custom");

  const rows: [number, number, number, number][] = [
    [a1, b1, c1, d1],
    [a2, b2, c2, d2],
    [a3, b3, c3, d3],
  ];

  const solution = useMemo(() => {
    const A = [
      [a1, b1, c1],
      [a2, b2, c2],
      [a3, b3, c3],
    ];
    const b = [d1, d2, d3];
    const aug = A.map((row, i) => [...row, b[i]]);
    const { rref, pivots } = matRref(aug);
    const n = 3;
    for (const row of rref) {
      const leftZero = row.slice(0, n).every((v) => Math.abs(v) < 1e-9);
      const rightNonzero = Math.abs(row[n] ?? 0) > 1e-9;
      if (leftZero && rightNonzero) return { type: "none" as const };
    }
    if (pivots.length < 3)
      return { type: "infinite" as const, rank: pivots.length };
    const sol = [0, 0, 0];
    for (let i = 0; i < pivots.length; i++) {
      const col = pivots[i];
      if (col !== undefined) {
        sol[col] = rref[i]?.[n] ?? 0;
      }
    }
    return { type: "unique" as const, sol };
  }, [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3]);

  // For the "line of solutions" case, draw a line along the free variable.
  const linePoints = useMemo<[number, number, number][] | null>(() => {
    if (solution.type !== "infinite" || solution.rank !== 2) return null;
    // Free variable: the column NOT in pivots.
    const pivotsSet = new Set([0, 1, 2].slice(0, solution.rank));
    // Pivots are always the first `rank` columns after rref, so the free
    // variable is column `rank`. Compute the line parametrically:
    // x_i = rref[i][n] - rref[i][free]*t for pivot rows, x_free = t.
    const aug = [
      [a1, b1, c1, d1],
      [a2, b2, c2, d2],
      [a3, b3, c3, d3],
    ];
    const { rref } = matRref(aug);
    const free = solution.rank;
    const pts: [number, number, number][] = [];
    for (let t = -3; t <= 3; t += 0.5) {
      const pt: [number, number, number] = [0, 0, 0];
      for (let row = 0; row < solution.rank; row++) {
        const col = row;
        pt[col] = (rref[row]?.[3] ?? 0) - (rref[row]?.[free] ?? 0) * t;
      }
      pt[free] = t;
      pts.push(pt);
    }
    return pts;
  }, [
    solution,
    a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3,
  ]);

  const activePreset = PRESETS.find((p) => p.id === presetId);

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => applyPreset(p.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs border transition",
              presetId === p.id
                ? "bg-accent/15 border-accent/40 text-accent"
                : "border-line bg-elev/40 text-dim hover:text-ink hover:bg-elev",
            )}
          >
            {p.label}
          </button>
        ))}
        {presetId === "custom" && (
          <span className="px-3 py-1.5 rounded-lg text-xs border border-warn/40 bg-warn/10 text-warn">
            Custom
          </span>
        )}
      </div>

      {activePreset && presetId !== "custom" && (
        <p className="text-xs text-dim leading-relaxed">{activePreset.blurb}</p>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* 3D viewport */}
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-ink">
              Three planes in 3D — where do they meet?
            </h3>
            <span className="text-[10px] text-faint font-mono">
              drag to orbit · scroll to zoom
            </span>
          </div>
          <div className="bg-canvas border border-line rounded h-[440px] overflow-hidden relative">
            <Canvas camera={{ position: [6, 5, 7], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.7} />
              <directionalLight position={[-3, 2, -2]} intensity={0.3} />
              <gridHelper args={[6, 6, "#3a3530", "#2a2520"]} />
              <axesHelper args={[1.5]} />
              {/* Axis labels */}
              <Html position={[1.7, 0, 0]} center>
                <span className="text-[10px] font-mono text-[#ff8a8a]">
                  x
                </span>
              </Html>
              <Html position={[0, 1.7, 0]} center>
                <span className="text-[10px] font-mono text-[#8aff8a]">
                  y
                </span>
              </Html>
              <Html position={[0, 0, 1.7]} center>
                <span className="text-[10px] font-mono text-[#8ab4ff]">
                  z
                </span>
              </Html>
              <PlaneMesh
                normal={[a1, b1, c1]}
                d={d1}
                color="#e8864a"
                label="P1"
              />
              <PlaneMesh
                normal={[a2, b2, c2]}
                d={d2}
                color="#6db3ff"
                label="P2"
              />
              <PlaneMesh
                normal={[a3, b3, c3]}
                d={d3}
                color="#4dd9a8"
                label="P3"
              />
              {solution.type === "unique" && (
                <group
                  position={[
                    solution.sol[0],
                    solution.sol[1],
                    solution.sol[2],
                  ]}
                >
                  <mesh>
                    <sphereGeometry args={[0.13, 24, 24]} />
                    <meshStandardMaterial
                      color="#ffcc66"
                      emissive="#ffcc66"
                      emissiveIntensity={0.8}
                    />
                  </mesh>
                  <Html center distanceFactor={8}>
                    <span className="text-[11px] font-mono text-[#ffcc66] font-semibold whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded">
                      solution
                    </span>
                  </Html>
                </group>
              )}
              {linePoints && (
                <Line
                  points={linePoints}
                  color="#ffcc66"
                  lineWidth={3}
                  dashed
                  dashSize={0.15}
                  gapSize={0.1}
                />
              )}
              <OrbitControls
                enablePan={false}
                minDistance={4}
                maxDistance={18}
              />
            </Canvas>
            {/* Legend */}
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur rounded px-2 py-1.5 text-[10px] font-mono space-y-1 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e8864a]" />
                <span className="text-[#e8864a]">P1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#6db3ff]" />
                <span className="text-[#6db3ff]">P2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#4dd9a8]" />
                <span className="text-[#4dd9a8]">P3</span>
              </div>
              <div className="flex items-center gap-1.5 border-t border-line pt-1 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffcc66]" />
                <span className="text-[#ffcc66]">solution</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: equations + status */}
        <div className="space-y-3">
          <EquationDisplay rows={rows} />

          <div
            className={cn(
              "rounded-xl p-4 border leading-relaxed",
              solution.type === "unique" &&
                "bg-accent/10 border-accent/30 text-accent",
              solution.type === "infinite" &&
                "bg-warn/10 border-warn/30 text-warn",
              solution.type === "none" &&
                "bg-warn/10 border-warn/30 text-warn",
            )}
          >
            {solution.type === "unique" && (
              <>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
                  <Sparkles size={11} aria-hidden="true" />
                  Unique solution
                </div>
                <div className="text-sm">
                  Three planes meet at{" "}
                  <span className="font-mono font-semibold">
                    ({solution.sol.map((s) => s.toFixed(2)).join(", ")})
                  </span>
                  .
                </div>
                <p className="text-[11px] mt-2 opacity-80">
                  That gold sphere <em>is</em> the (x, y, z) that satisfies
                  all three equations simultaneously.
                </p>
              </>
            )}
            {solution.type === "infinite" && (
              <>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
                  <InfIcon size={11} aria-hidden="true" />
                  Infinitely many solutions
                </div>
                <div className="text-sm">
                  Rank = {solution.rank}. Two equations are redundant or
                  parallel — every point on the dashed line satisfies all
                  three.
                </div>
              </>
            )}
            {solution.type === "none" && (
              <>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
                  <AlertTriangle size={11} aria-hidden="true" />
                  No solution
                </div>
                <div className="text-sm">
                  The three planes contradict each other — there is no (x, y, z)
                  that lies on all three.
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Manual sliders — for exploration */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="bg-card border border-line rounded-xl p-3">
          <div
            className="text-[10px] uppercase tracking-wider mb-2 font-medium"
            style={{ color: "#e8864a" }}
          >
            Plane 1 (orange)
          </div>
          <Slider label="a" value={a1} min={-3} max={3} step={0.1} onChange={(v) => { setA1(v); onSliderChange(); }} />
          <Slider label="b" value={b1} min={-3} max={3} step={0.1} onChange={(v) => { setB1(v); onSliderChange(); }} />
          <Slider label="c" value={c1} min={-3} max={3} step={0.1} onChange={(v) => { setC1(v); onSliderChange(); }} />
          <Slider label="d" value={d1} min={-3} max={3} step={0.1} onChange={(v) => { setD1(v); onSliderChange(); }} />
        </div>
        <div className="bg-card border border-line rounded-xl p-3">
          <div
            className="text-[10px] uppercase tracking-wider mb-2 font-medium"
            style={{ color: "#6db3ff" }}
          >
            Plane 2 (blue)
          </div>
          <Slider label="a" value={a2} min={-3} max={3} step={0.1} onChange={(v) => { setA2(v); onSliderChange(); }} />
          <Slider label="b" value={b2} min={-3} max={3} step={0.1} onChange={(v) => { setB2(v); onSliderChange(); }} />
          <Slider label="c" value={c2} min={-3} max={3} step={0.1} onChange={(v) => { setC2(v); onSliderChange(); }} />
          <Slider label="d" value={d2} min={-3} max={3} step={0.1} onChange={(v) => { setD2(v); onSliderChange(); }} />
        </div>
        <div className="bg-card border border-line rounded-xl p-3">
          <div
            className="text-[10px] uppercase tracking-wider mb-2 font-medium"
            style={{ color: "#4dd9a8" }}
          >
            Plane 3 (green)
          </div>
          <Slider label="a" value={a3} min={-3} max={3} step={0.1} onChange={(v) => { setA3(v); onSliderChange(); }} />
          <Slider label="b" value={b3} min={-3} max={3} step={0.1} onChange={(v) => { setB3(v); onSliderChange(); }} />
          <Slider label="c" value={c3} min={-3} max={3} step={0.1} onChange={(v) => { setC3(v); onSliderChange(); }} />
          <Slider label="d" value={d3} min={-3} max={3} step={0.1} onChange={(v) => { setD3(v); onSliderChange(); }} />
        </div>
      </div>
    </div>
  );
}
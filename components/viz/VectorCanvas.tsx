"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/cn";

export interface Vec2 {
  x: number;
  y: number;
}

export interface ArrowProps {
  from?: Vec2;
  to: Vec2;
  color?: string;
  label?: string;
  dashed?: boolean;
  width?: number;
  labelOffset?: Vec2;
  showTip?: boolean;
}

export interface GridLine {
  from: Vec2;
  to: Vec2;
  color?: string;
  width?: number;
  dashed?: boolean;
}

export interface PolygonProps {
  points: Vec2[];
  fill?: string;
  stroke?: string;
  fillOpacity?: number;
  strokeWidth?: number;
}

export interface VectorCanvasProps {
  width?: number;
  height?: number;
  worldSize?: number; // half-size of world coords (default 10, so world is -10..10)
  showGrid?: boolean;
  showAxes?: boolean;
  showOrigin?: boolean;
  gridStep?: number;
  background?: boolean;
  className?: string;
  arrows?: ArrowProps[];
  polygons?: PolygonProps[];
  gridLines?: GridLine[]; // for warping the grid under a transform
  // Mouse interaction: when set, the canvas becomes draggable; callback receives
  // the world-space coordinate of the pointer.
  onPointerMove?: (world: Vec2) => void;
  onPointerDown?: (world: Vec2) => void;
  onPointerUp?: (world: Vec2) => void;
  children?: React.ReactNode;
}

// Convert world coords to pixel coords
function worldToPixel(
  p: Vec2,
  size: number,
  worldSize: number,
): { x: number; y: number } {
  const scale = size / (2 * worldSize);
  return {
    x: size / 2 + p.x * scale,
    y: size / 2 - p.y * scale, // flip y so up is positive
  };
}

function pixelToWorld(
  p: { x: number; y: number },
  size: number,
  worldSize: number,
): Vec2 {
  const scale = size / (2 * worldSize);
  return {
    x: (p.x - size / 2) / scale,
    y: (size / 2 - p.y) / scale,
  };
}

function Arrow({
  from = { x: 0, y: 0 },
  to,
  color = "var(--vector)",
  label,
  dashed = false,
  width = 2,
  labelOffset = { x: 0, y: 0 },
  showTip = true,
  size,
  worldSize,
}: ArrowProps & { size: number; worldSize: number }) {
  const a = worldToPixel(from, size, worldSize);
  const b = worldToPixel(to, size, worldSize);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.001) return null;
  const ux = dx / len;
  const uy = dy / len;
  // Tip
  const tipLen = Math.max(8, width * 5);
  const tipBack = {
    x: b.x - ux * tipLen,
    y: b.y - uy * tipLen,
  };
  const perpX = -uy;
  const perpY = ux;
  const tipHalfWidth = tipLen * 0.45;
  const tipLeft = {
    x: tipBack.x + perpX * tipHalfWidth,
    y: tipBack.y + perpY * tipHalfWidth,
  };
  const tipRight = {
    x: tipBack.x - perpX * tipHalfWidth,
    y: tipBack.y - perpY * tipHalfWidth,
  };
  const labelPos = worldToPixel(
    { x: (to.x + from.x) / 2 + labelOffset.x, y: (to.y + from.y) / 2 + labelOffset.y },
    size,
    worldSize,
  );
  return (
    <g>
      <line
        x1={a.x}
        y1={a.y}
        x2={tipBack.x}
        y2={tipBack.y}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "4 4" : undefined}
      />
      {showTip && (
        <polygon
          points={`${b.x},${b.y} ${tipLeft.x},${tipLeft.y} ${tipRight.x},${tipRight.y}`}
          fill={color}
        />
      )}
      {label && (
        <text
          x={labelPos.x}
          y={labelPos.y}
          fill={color}
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Polygon({ points, fill, stroke, fillOpacity = 0.2, strokeWidth = 1.5, size, worldSize }: PolygonProps & { size: number; worldSize: number }) {
  if (points.length < 2) return null;
  const pts = points.map((p) => worldToPixel(p, size, worldSize));
  const d = pts.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <polygon
      points={d}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

function GridLine({ from, to, color = "var(--ink-faint)", width = 0.5, dashed = false, size, worldSize }: GridLine & { size: number; worldSize: number }) {
  const a = worldToPixel(from, size, worldSize);
  const b = worldToPixel(to, size, worldSize);
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "2 4" : undefined}
      opacity={0.5}
    />
  );
}

export function VectorCanvas({
  width = 480,
  height = 480,
  worldSize = 10,
  showGrid = true,
  showAxes = true,
  showOrigin = true,
  gridStep = 1,
  background = true,
  className,
  arrows = [],
  polygons = [],
  gridLines = [],
  onPointerMove,
  onPointerDown,
  onPointerUp,
  children,
}: VectorCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<Vec2 | null>(null);

  const handlePointerEvent = useCallback(
    (e: React.PointerEvent<SVGSVGElement>, handler?: (w: Vec2) => void) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      // Normalize to viewBox space
      const vbX = (px / rect.width) * width;
      const vbY = (py / rect.height) * height;
      handler?.(pixelToWorld({ x: vbX, y: vbY }, width, worldSize));
    },
    [width, height, worldSize],
  );

  // Build background grid
  const grid: GridLine[] = [];
  if (showGrid) {
    for (let i = -worldSize; i <= worldSize; i += gridStep) {
      if (Math.abs(i) < 0.001) continue;
      grid.push({ from: { x: -worldSize, y: i }, to: { x: worldSize, y: i } });
      grid.push({ from: { x: i, y: -worldSize }, to: { x: i, y: worldSize } });
    }
  }

  return (
    <div className={cn("relative inline-block select-none", className)} style={{ width, height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className={cn(
          "rounded-lg border border-line",
          background && "bg-canvas",
        )}
        style={{ width, height, display: "block", cursor: onPointerMove ? "crosshair" : "default" }}
        onPointerDown={(e) => handlePointerEvent(e, onPointerDown)}
        onPointerUp={(e) => handlePointerEvent(e, onPointerUp)}
        onPointerMove={(e) => {
          const w = pixelToWorld(
            {
              x: ((e.clientX - (svgRef.current?.getBoundingClientRect().left ?? 0)) /
                (svgRef.current?.getBoundingClientRect().width ?? width)) * width,
              y: ((e.clientY - (svgRef.current?.getBoundingClientRect().top ?? 0)) /
                (svgRef.current?.getBoundingClientRect().height ?? height)) * height,
            },
            width,
            worldSize,
          );
          setHover(w);
          onPointerMove?.(w);
        }}
        onPointerLeave={() => setHover(null)}
      >
        {/* Background grid (drawn first, behind everything) */}
        {showGrid && grid.map((g, i) => (
          <GridLine key={`bg-${i}`} {...g} size={width} worldSize={worldSize} />
        ))}

        {/* User-provided grid lines (e.g. warped under a transform) */}
        {gridLines.map((g, i) => (
          <GridLine key={`gl-${i}`} {...g} size={width} worldSize={worldSize} />
        ))}

        {/* Axes (drawn over grid) */}
        {showAxes && (
          <>
            <line
              x1={0}
              y1={height / 2}
              x2={width}
              y2={height / 2}
              stroke="var(--ink-dim)"
              strokeWidth={1}
            />
            <line
              x1={width / 2}
              y1={0}
              x2={width / 2}
              y2={height}
              stroke="var(--ink-dim)"
              strokeWidth={1}
            />
            {/* Axis labels */}
            <text x={width - 14} y={height / 2 - 8} fill="var(--ink-dim)" fontSize="11" textAnchor="end" fontFamily="ui-monospace, monospace">x</text>
            <text x={width / 2 + 8} y={14} fill="var(--ink-dim)" fontSize="11" fontFamily="ui-monospace, monospace">y</text>
          </>
        )}

        {/* Origin */}
        {showOrigin && (
          <circle cx={width / 2} cy={height / 2} r={3} fill="var(--ink-dim)" />
        )}

        {/* Polygons */}
        {polygons.map((p, i) => (
          <Polygon key={`poly-${i}`} {...p} size={width} worldSize={worldSize} />
        ))}

        {/* Arrows */}
        {arrows.map((a, i) => (
          <Arrow key={`arr-${i}`} {...a} size={width} worldSize={worldSize} />
        ))}

        {/* Hover crosshair */}
        {hover && onPointerMove && (
          <g pointerEvents="none">
            <line
              x1={worldToPixel(hover, width, worldSize).x}
              y1={0}
              x2={worldToPixel(hover, width, worldSize).x}
              y2={height}
              stroke="var(--accent)"
              strokeWidth={0.5}
              strokeDasharray="2 3"
              opacity={0.5}
            />
            <line
              x1={0}
              y1={worldToPixel(hover, width, worldSize).y}
              x2={width}
              y2={worldToPixel(hover, width, worldSize).y}
              stroke="var(--accent)"
              strokeWidth={0.5}
              strokeDasharray="2 3"
              opacity={0.5}
            />
            <circle
              cx={worldToPixel(hover, width, worldSize).x}
              cy={worldToPixel(hover, width, worldSize).y}
              r={4}
              fill="var(--accent)"
            />
            <text
              x={worldToPixel(hover, width, worldSize).x + 8}
              y={worldToPixel(hover, width, worldSize).y - 8}
              fill="var(--accent)"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
            >
              ({hover.x.toFixed(2)}, {hover.y.toFixed(2)})
            </text>
          </g>
        )}

        {children}
      </svg>
    </div>
  );
}

export { worldToPixel, pixelToWorld };

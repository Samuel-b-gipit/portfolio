"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Edge {
  a: number; // node index; -1 = centre
  b: number;
  key: string;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const SVG_SIZE = 960;
const CENTER: Point = { x: 480, y: 480 };
const MIN_RADIUS = 500;
const MAX_RADIUS = 1000;
const MIN_NODE_DIST = 1000;
const NODE_SIZE = 96;
const CENTER_SIZE = 232;

const TECHS = [
  { id: "react", label: "React", icon: "/hero/React.png" },
  { id: "nextjs", label: "Next.js", icon: "/hero/next-js.png" },
  { id: "typescript", label: "TypeScript", icon: "/hero/typescript.png" },
  { id: "nodejs", label: "Node.js", icon: "/hero/nodejs.png" },
  { id: "postgresql", label: "PostgreSQL", icon: "/hero/postgreSQL.png" },
  { id: "prisma", label: "Prisma", icon: "/hero/prisma.png" },
  { id: "express", label: "Express", icon: "/hero/express.png" },
  { id: "tailwind", label: "Tailwind", icon: "/hero/tailwind.png" },
  { id: "AWS", label: "AWS", icon: "/hero/AWS.png" },
] as const;

const PULSE_DURATIONS = [3.2, 4.1, 3.7, 5.0, 2.8, 4.4, 3.5, 4.8, 3.1, 4.6];

// ─── Deterministic RNG (Park-Miller LCG) ──────────────────────────────────────

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Node layout ───────────────────────────────────────────────────────────────

function generateNodePositions(seed: number): Point[] {
  const rng = makeRng(seed);
  const positions: Point[] = [];

  for (let i = 0; i < TECHS.length; i++) {
    let placed = false;

    for (let attempt = 0; attempt < 500; attempt++) {
      const angle = rng() * Math.PI * 2;
      const radius = MIN_RADIUS + rng() * (MAX_RADIUS - MIN_RADIUS);
      const x = CENTER.x + Math.cos(angle) * radius;
      const y = CENTER.y + Math.sin(angle) * radius;

      const pad = NODE_SIZE / 2 + 4;
      if (x < pad || x > SVG_SIZE - pad || y < pad || y > SVG_SIZE - pad)
        continue;

      const tooClose = positions.some(
        (p) => Math.hypot(p.x - x, p.y - y) < MIN_NODE_DIST,
      );
      if (tooClose) continue;

      positions.push({ x, y });
      placed = true;
      break;
    }

    if (!placed) {
      const a = (i / TECHS.length) * Math.PI * 2 + rng() * 0.5;
      const r = MIN_RADIUS + rng() * (MAX_RADIUS - MIN_RADIUS) * 0.5;
      positions.push({
        x: CENTER.x + Math.cos(a) * r,
        y: CENTER.y + Math.sin(a) * r,
      });
    }
  }

  return positions;
}

// ─── Geometry: does an edge pass through a node? ──────────────────────────────

const NODE_HIT_RADIUS = NODE_SIZE * 0.6;
const CENTER_HIT_RADIUS = CENTER_SIZE / 2 + 10;

function pointToSegmentDist(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2),
  );
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function edgeCrossesAnyNode(
  startIdx: number,
  endIdx: number,
  positions: Point[],
): boolean {
  const start = startIdx === -1 ? CENTER : positions[startIdx];
  const end = endIdx === -1 ? CENTER : positions[endIdx];

  for (let k = 0; k < positions.length; k++) {
    if (k === startIdx || k === endIdx) continue;
    if (pointToSegmentDist(positions[k], start, end) < NODE_HIT_RADIUS)
      return true;
  }

  // Check centre node (unless the edge itself connects to centre)
  if (startIdx !== -1 && endIdx !== -1) {
    if (pointToSegmentDist(CENTER, start, end) < CENTER_HIT_RADIUS) return true;
  }

  return false;
}

// ─── Edge generation (proximity-based, no node-crossing) ──────────────────────

function generateEdges(positions: Point[]): Edge[] {
  const edgeSet = new Set<string>();

  // Each node connects to up to 3 nearest neighbours, skipping edges that
  // would visually pass through an unrelated node.
  for (let i = 0; i < positions.length; i++) {
    const nearest = positions
      .map((p, j) => ({
        j,
        d: Math.hypot(p.x - positions[i].x, p.y - positions[i].y),
      }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d);

    let added = 0;
    for (const { j } of nearest) {
      if (added >= 3) break;
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (edgeSet.has(key)) {
        added++;
        continue;
      }
      if (!edgeCrossesAnyNode(i, j, positions)) {
        edgeSet.add(key);
        added++;
      }
    }
  }

  // Verify every node has at least 2 connections, adding more if needed
  const connectionCount = new Map<number, number>();
  for (const key of edgeSet) {
    const [a, b] = key.split("-").map(Number);
    if (!isNaN(a)) connectionCount.set(a, (connectionCount.get(a) ?? 0) + 1);
    if (!isNaN(b)) connectionCount.set(b, (connectionCount.get(b) ?? 0) + 1);
  }
  for (let i = 0; i < positions.length; i++) {
    if ((connectionCount.get(i) ?? 0) < 2) {
      const nearest = positions
        .map((p, j) => ({
          j,
          d: Math.hypot(p.x - positions[i].x, p.y - positions[i].y),
        }))
        .filter((e) => e.j !== i)
        .sort((a, b) => a.d - b.d);
      for (const { j } of nearest) {
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (!edgeSet.has(key) && !edgeCrossesAnyNode(i, j, positions)) {
          edgeSet.add(key);
          connectionCount.set(i, (connectionCount.get(i) ?? 0) + 1);
          connectionCount.set(j, (connectionCount.get(j) ?? 0) + 1);
          if ((connectionCount.get(i) ?? 0) >= 2) break;
        }
      }
    }
  }

  // 3 closest nodes get a spoke to centre (skip if it crosses a node)
  const closestToCenter = positions
    .map((p, i) => ({ i, d: Math.hypot(p.x - CENTER.x, p.y - CENTER.y) }))
    .sort((a, b) => a.d - b.d);

  let spokes = 0;
  for (const { i } of closestToCenter) {
    if (spokes >= 3) break;
    if (!edgeCrossesAnyNode(-1, i, positions)) {
      edgeSet.add(`c-${i}`);
      spokes++;
    }
  }

  return Array.from(edgeSet).map((key) => {
    const [first, second] = key.split("-");
    if (first === "c") return { a: -1, b: parseInt(second, 10), key };
    return { a: parseInt(first, 10), b: parseInt(second, 10), key };
  });
}

// ─── Droplet pulse gradient definition ─────────────────────────────────────────

function PulseGradients({ isDark }: { isDark: boolean }) {
  const headColor = isDark ? "#8AB4FF" : "#4F7CFF";
  const tailColor = isDark ? "rgba(138,180,255,0)" : "rgba(79,124,255,0)";
  const glowStdDev = isDark ? 3 : 1.5;

  return (
    <defs>
      <linearGradient id="pulseGrad" x1="1" y1="0.5" x2="0" y2="0.5">
        <stop offset="0%" stopColor={headColor} stopOpacity="0.8" />
        <stop offset="30%" stopColor={headColor} stopOpacity="0.4" />
        <stop offset="100%" stopColor={tailColor} />
      </linearGradient>
      <filter id="pulseGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {/* Large-extent filter so glow renders on lines that extend beyond SVG viewport */}
      <filter id="lineGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation={glowStdDev}
          result="blur"
        />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// ─── Energy pulse along an edge ────────────────────────────────────────────────

function EnergyPulse({
  start,
  end,
  duration,
  reverse,
  isDark,
}: {
  start: Point;
  end: Point;
  duration: number;
  reverse: boolean;
  isDark: boolean;
}) {
  const p1 = reverse ? end : start;
  const p2 = reverse ? start : end;
  const path = `M ${p1.x},${p1.y} L ${p2.x},${p2.y}`;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const headColor = isDark ? "#8AB4FF" : "#4F7CFF";

  return (
    <g filter="url(#pulseGlow)">
      {/* Droplet head — bright, leading the motion */}
      <ellipse cx="0" cy="0" rx="10" ry="4" fill={headColor} opacity="0.9">
        <animateMotion
          path={path}
          dur={`${duration}s`}
          repeatCount="indefinite"
          rotate="auto"
        />
      </ellipse>
      {/* Stretched comet tail trailing behind */}
      <ellipse
        cx="-16"
        cy="0"
        rx="28"
        ry="3"
        fill="url(#pulseGrad)"
        opacity="0.55"
      >
        <animateMotion
          path={path}
          dur={`${duration}s`}
          repeatCount="indefinite"
          rotate="auto"
        />
      </ellipse>
    </g>
  );
}

// ─── NodeItem ──────────────────────────────────────────────────────────────────

interface NodeItemProps {
  tech: (typeof TECHS)[number];
  pos: Point;
  idx: number;
  isDark: boolean;
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}

function NodeItem({
  tech,
  pos,
  idx,
  isDark,
  hoveredIdx,
  onHover,
  smoothX,
  smoothY,
}: NodeItemProps) {
  const depth = Math.hypot(pos.x - CENTER.x, pos.y - CENTER.y) / MAX_RADIUS;
  const px = useTransform(smoothX, (v) => v * depth * 18);
  const py = useTransform(smoothY, (v) => v * depth * 18);

  const isHovered = hoveredIdx === idx;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${(pos.x / SVG_SIZE) * 100}%`,
        top: `${(pos.y / SVG_SIZE) * 100}%`,
        width: NODE_SIZE,
        height: NODE_SIZE,
        marginLeft: -NODE_SIZE / 2,
        marginTop: -NODE_SIZE / 2,
        zIndex: 20,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: idx * 0.06 }}
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div className="w-full h-full" style={{ x: px, y: py }}>
        <motion.div
          className="w-full h-full flex items-center justify-center cursor-default"
          animate={{
            y: [0, -6, 0],
            scale: isHovered ? 1.25 : 1,
          }}
          transition={{
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.4,
            },
            scale: { duration: 0.2 },
          }}
          style={{
            filter: isHovered
              ? isDark
                ? "drop-shadow(0 0 8px rgba(138,180,255,0.6))"
                : "drop-shadow(0 0 6px rgba(79,124,255,0.4))"
              : "none",
          }}
        >
          {isDark ? (
            <Image
              src={tech.icon}
              alt={tech.label}
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
              unoptimized
            />
          ) : (
            <span
              className="text-base font-semibold text-foreground/80 text-center leading-tight select-none whitespace-nowrap"
              style={{
                textShadow: isHovered ? "0 0 8px rgba(79,124,255,0.3)" : "none",
              }}
            >
              {tech.label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── TechConstellation ─────────────────────────────────────────────────────────

export default function TechConstellation() {
  const [mounted, setMounted] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [seed, setSeed] = useState(42);
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  // Regenerate positions/edges when seed changes
  const nodePositions = generateNodePositions(seed);
  const edges = generateEdges(nodePositions);

  const handleCenterClick = useCallback(() => {
    setSeed((prev) => prev + Math.floor(Math.random() * 1000) + 1);
  }, []);

  // Parallax motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 40, damping: 15 });
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    rawY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };

  // Theme-aware line colors
  const lineColor = isDark ? "rgba(120,140,255,0.35)" : "rgba(80,90,120,0.35)";

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* ── Constellation canvas ── */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[60rem] mx-auto"
        style={{ aspectRatio: "1" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          rawX.set(0);
          rawY.set(0);
        }}
      >
        {/* SVG: visible constellation lines + energy pulses */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          overflow="visible"
          style={{ overflow: "visible" }}
        >
          <PulseGradients isDark={isDark} />

          {/* Layer 1: Always-visible constellation lines (grouped so SVG filter applies without viewport clipping) */}
          <g filter="url(#lineGlowFilter)">
            {edges.map((edge) => {
              const start = edge.a === -1 ? CENTER : nodePositions[edge.a];
              const end = nodePositions[edge.b];
              const lit =
                hoveredIdx !== null &&
                (edge.a === hoveredIdx || edge.b === hoveredIdx);
              return (
                <line
                  key={`line-${edge.key}-${seed}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={lineColor}
                  strokeWidth={lit ? 1.6 : 1}
                  opacity={lit ? 0.8 : 1}
                  style={{
                    transition: "stroke-width 0.25s, opacity 0.25s",
                  }}
                />
              );
            })}
          </g>

          {/* Layer 2: Droplet energy pulses traveling along lines */}
          {edges.map((edge, i) => {
            const start = edge.a === -1 ? CENTER : nodePositions[edge.a];
            const end = nodePositions[edge.b];
            const dur = PULSE_DURATIONS[i % PULSE_DURATIONS.length];

            return (
              <EnergyPulse
                key={`pulse-${edge.key}-${seed}`}
                start={start}
                end={end}
                duration={dur}
                reverse={i % 2 === 0}
                isDark={isDark}
              />
            );
          })}
        </svg>

        {/* Centre profile circle — click to regenerate constellation */}
        <div
          className="absolute rounded-full overflow-hidden bg-linear-to-br from-primary/20 via-card to-accent/20 border-2 border-primary/30 flex items-center justify-center z-10 shadow-lg shadow-primary/10 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{
            width: CENTER_SIZE,
            height: CENTER_SIZE,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          onClick={handleCenterClick}
          title="Click to regenerate constellation"
        >
          <span className="text-6xl font-bold bg-linear-to-br from-primary to-accent bg-clip-text text-transparent select-none">
            SG
          </span>
        </div>

        {/* Technology nodes */}
        <AnimatePresence mode="wait">
          {TECHS.map((tech, i) => (
            <NodeItem
              key={`${tech.id}-${seed}`}
              tech={tech}
              pos={nodePositions[i]}
              idx={i}
              isDark={isDark}
              hoveredIdx={hoveredIdx}
              onHover={setHoveredIdx}
              smoothX={smoothX}
              smoothY={smoothY}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-5 text-lg text-muted-foreground flex-wrap justify-center mt-20">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-primary/70" />
          6+ Projects
        </span>
        <span className="text-border select-none">|</span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-accent/70" />
          17K+ Users
        </span>
        <span className="text-border select-none">|</span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-primary/70" />
          2+ Years
        </span>
      </div>
    </motion.div>
  );
}

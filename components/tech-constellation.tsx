"use client";

import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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

const SVG_SIZE = 480;
const CENTER: Point = { x: 240, y: 240 };
const MIN_RADIUS = 130;
const MAX_RADIUS = 215;
const MIN_NODE_DIST = 80;
const NODE_SIZE = 48;
const CENTER_SIZE = 116;

const TECHS = [
  { id: "react", label: "React", icon: "/hero/React.png" },
  { id: "nextjs", label: "Next.js", icon: "/hero/next-js.svg" },
  { id: "typescript", label: "TypeScript", icon: "/hero/typescript.png" },
  { id: "nodejs", label: "Node.js", icon: "/hero/nodejs.png" },
  { id: "postgresql", label: "PostgreSQL", icon: "/hero/postgreSQL.png" },
  { id: "prisma", label: "Prisma", icon: "/hero/prisma.jpg" },
  { id: "express", label: "Express", icon: "/hero/express.png" },
  { id: "tailwind", label: "Tailwind", icon: "/hero/tailwind.png" },
] as const;

// Staggered durations give each edge a different particle rhythm
const PARTICLE_DURATIONS = [3.2, 4.1, 3.7, 5.0, 2.8, 4.4, 3.5, 4.8, 3.1, 4.6];

// ─── Deterministic RNG (Park-Miller LCG, seed = 42) ───────────────────────────

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Node layout ───────────────────────────────────────────────────────────────

function generateNodePositions(): Point[] {
  const rng = makeRng(42);
  const positions: Point[] = [];

  for (let i = 0; i < TECHS.length; i++) {
    let placed = false;

    for (let attempt = 0; attempt < 300; attempt++) {
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
      // Evenly-spaced fallback — guarantees we always get 8 nodes
      const a = (i / TECHS.length) * Math.PI * 2;
      positions.push({
        x: CENTER.x + Math.cos(a) * MIN_RADIUS,
        y: CENTER.y + Math.sin(a) * MIN_RADIUS,
      });
    }
  }

  return positions;
}

// ─── Edge generation ───────────────────────────────────────────────────────────

function generateEdges(positions: Point[]): Edge[] {
  const edgeSet = new Set<string>();

  // Each node → its 2 nearest neighbours (up to 235 px away)
  for (let i = 0; i < positions.length; i++) {
    const nearest = positions
      .map((p, j) => ({
        j,
        d: Math.hypot(p.x - positions[i].x, p.y - positions[i].y),
      }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d);

    for (const { j, d } of nearest.slice(0, 2)) {
      if (d <= 235) edgeSet.add(`${Math.min(i, j)}-${Math.max(i, j)}`);
    }
  }

  // The 3 closest nodes also get a spoke directly to the centre
  positions
    .map((p, i) => ({ i, d: Math.hypot(p.x - CENTER.x, p.y - CENTER.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .forEach(({ i }) => edgeSet.add(`c-${i}`));

  return Array.from(edgeSet).map((key) => {
    const [first, second] = key.split("-");
    if (first === "c") return { a: -1, b: parseInt(second, 10), key };
    return { a: parseInt(first, 10), b: parseInt(second, 10), key };
  });
}

// Pre-computed at module load — pure maths, no side-effects, SSR-safe
const NODE_POSITIONS = generateNodePositions();
const EDGES = generateEdges(NODE_POSITIONS);

// ─── NodeItem ──────────────────────────────────────────────────────────────────

interface NodeItemProps {
  tech: (typeof TECHS)[number];
  pos: Point;
  idx: number;
  isDark: boolean;
  onHover: (idx: number | null) => void;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}

function NodeItem({
  tech,
  pos,
  idx,
  isDark,
  onHover,
  smoothX,
  smoothY,
}: NodeItemProps) {
  // Nodes farther from the centre experience more parallax shift
  const depth = Math.hypot(pos.x - CENTER.x, pos.y - CENTER.y) / MAX_RADIUS;
  const px = useTransform(smoothX, (v) => v * depth * 18);
  const py = useTransform(smoothY, (v) => v * depth * 18);

  return (
    <div
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
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Parallax layer — shifts with mouse position */}
      <motion.div className="w-full h-full" style={{ x: px, y: py }}>
        {/* Float + hover layer */}
        <motion.div
          className="w-full h-full rounded-full bg-card/90 border border-primary/30 shadow-sm flex items-center justify-center overflow-hidden cursor-default"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: idx * 0.4,
          }}
          whileHover={{ scale: 1.18 }}
        >
          {isDark ? (
            <Image
              src={tech.icon}
              alt={tech.label}
              width={30}
              height={30}
              className="w-7.5 h-7.5 object-contain"
              unoptimized
            />
          ) : (
            <span className="text-[9px] font-semibold text-foreground/80 text-center leading-tight px-1 select-none">
              {tech.label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── TechConstellation ─────────────────────────────────────────────────────────

export default function TechConstellation() {
  const [mounted, setMounted] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Default to dark (matches app's defaultTheme="dark") until mounted
  const isDark = mounted ? resolvedTheme === "dark" : true;

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

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* ── Constellation canvas ── */}
      <div
        ref={containerRef}
        className="relative w-full max-w-120 mx-auto"
        style={{ aspectRatio: "1" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          rawX.set(0);
          rawY.set(0);
        }}
      >
        {/* SVG: connection lines + flowing particles */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          {EDGES.map((edge) => {
            const start = edge.a === -1 ? CENTER : NODE_POSITIONS[edge.a];
            const end = NODE_POSITIONS[edge.b];
            const lit =
              hoveredIdx !== null &&
              (edge.a === hoveredIdx || edge.b === hoveredIdx);
            return (
              <line
                key={`line-${edge.key}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="hsl(var(--primary))"
                strokeWidth={lit ? 1.3 : 0.75}
                strokeOpacity={lit ? 0.65 : 0.2}
                style={{
                  transition: "stroke-width 0.25s, stroke-opacity 0.25s",
                }}
              />
            );
          })}

          {/* Flowing energy particles */}
          {EDGES.map((edge, i) => {
            const start = edge.a === -1 ? CENTER : NODE_POSITIONS[edge.a];
            const end = NODE_POSITIONS[edge.b];
            const dur = PARTICLE_DURATIONS[i % PARTICLE_DURATIONS.length];
            const pathFwd = `M ${start.x},${start.y} L ${end.x},${end.y}`;
            const pathRev = `M ${end.x},${end.y} L ${start.x},${start.y}`;

            return (
              <g key={`particles-${edge.key}`}>
                {/* Primary particle — purple, some edges travel in reverse */}
                <circle r="1.8" fill="hsl(var(--primary))" opacity="0.9">
                  <animateMotion
                    path={i % 3 === 0 ? pathRev : pathFwd}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                    begin="0s"
                  />
                </circle>
                {/* Accent particle — gold, staggered by half-period */}
                <circle r="1.4" fill="hsl(var(--accent))" opacity="0.65">
                  <animateMotion
                    path={pathFwd}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                    begin={`${dur / 2}s`}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Centre profile circle */}
        <div
          className="absolute rounded-full overflow-hidden bg-linear-to-br from-primary/20 via-card to-accent/20 border-2 border-primary/30 flex items-center justify-center z-10 shadow-lg shadow-primary/10"
          style={{
            width: CENTER_SIZE,
            height: CENTER_SIZE,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Replace with <Image src="/profile.jpg" … /> when ready */}
          <span className="text-3xl font-bold bg-linear-to-br from-primary to-accent bg-clip-text text-transparent select-none">
            SG
          </span>
        </div>

        {/* Technology nodes */}
        {TECHS.map((tech, i) => (
          <NodeItem
            key={tech.id}
            tech={tech}
            pos={NODE_POSITIONS[i]}
            idx={i}
            isDark={isDark}
            onHover={setHoveredIdx}
            smoothX={smoothX}
            smoothY={smoothY}
          />
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap justify-center">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-primary/70" />
          6+ Projects
        </span>
        <span className="text-border select-none">|</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-accent/70" />
          17K+ Users
        </span>
        <span className="text-border select-none">|</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-primary/70" />
          2+ Years
        </span>
      </div>
    </motion.div>
  );
}

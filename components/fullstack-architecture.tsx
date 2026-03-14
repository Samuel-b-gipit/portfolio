"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Tech data ─────────────────────────────────────────────────────────────────

interface Tech {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

const TECH: Record<string, Tech> = {
  react: {
    id: "react",
    label: "React",
    icon: "/hero/React.png",
    desc: "UI library",
  },
  nextjs: {
    id: "nextjs",
    label: "Next.js",
    icon: "/hero/next-js.png",
    desc: "Framework & API routes",
  },
  tailwind: {
    id: "tailwind",
    label: "Tailwind CSS",
    icon: "/hero/tailwind.png",
    desc: "Utility-first styling",
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    icon: "/hero/typescript.png",
    desc: "Strongly-typed JS",
  },
  express: {
    id: "express",
    label: "Express",
    icon: "/hero/express.png",
    desc: "Server & API framework",
  },
  nodejs: {
    id: "nodejs",
    label: "Node.js",
    icon: "/hero/nodejs.png",
    desc: "Server runtime",
  },
  aws: {
    id: "aws",
    label: "AWS",
    icon: "/hero/AWS.png",
    desc: "Cloud services",
  },
  prisma: {
    id: "prisma",
    label: "Prisma",
    icon: "/hero/prisma.png",
    desc: "Database ORM",
  },
  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
    icon: "/hero/postgreSQL.png",
    desc: "Relational database",
  },
};

// ─── Pyramid geometry ──────────────────────────────────────────────────────────
// halfWidth(t) = MIN_HALF + t * (MAX_HALF - MIN_HALF)
// At t=0: pointed apex. At t=1: 96% wide (base).
// Slices are horizontal cuts of this same pyramid with gaps in between.

const MIN_HALF = 8;
const MAX_HALF = 48;

function halfW(t: number) {
  return MIN_HALF + t * (MAX_HALF - MIN_HALF);
}
function leftX(t: number) {
  return 50 - halfW(t);
}
function rightX(t: number) {
  return 50 + halfW(t);
}

// Slice vertical ranges (as fraction of container height, 0=top 1=bottom)
// When gaps are removed, edges align to form one continuous triangle.
interface SliceDef {
  label: string;
  topT: number;
  botT: number;
  accentColor: string;
  fillId: string;
  nodes: { techId: string; x: number; y: number }[];
}

const SLICES: SliceDef[] = [
  {
    label: "Frontend",
    topT: -0.2,
    botT: 0.28,
    accentColor: "rgb(56,189,248)",
    fillId: "feFill",
    nodes: [
      { techId: "typescript", x: 50, y: 2 },
      { techId: "react", x: 43, y: 13 },
      { techId: "nextjs", x: 57.5, y: 13 },
      { techId: "tailwind", x: 50, y: 20 },
    ],
  },
  {
    label: "API",
    topT: 0.36,
    botT: 0.64,
    accentColor: "rgb(251,191,36)",
    fillId: "apiFill",
    nodes: [
      { techId: "nodejs", x: 36, y: 45 },
      { techId: "express", x: 55, y: 45 },
      { techId: "nextjs", x: 44, y: 57 },
      { techId: "aws", x: 67, y: 55 },
    ],
  },
  {
    label: "Backend",
    topT: 0.72,
    botT: 1.0,
    accentColor: "rgb(52,211,153)",
    fillId: "beFill",
    nodes: [
      { techId: "nodejs", x: 20, y: 81 },
      { techId: "express", x: 75, y: 81 },
      { techId: "aws", x: 85, y: 93 },
      { techId: "prisma", x: 48, y: 82 },
      { techId: "postgresql", x: 62, y: 94 },
      { techId: "typescript", x: 33, y: 94 },
    ],
  },
];

// Polygon points string for each slice (viewBox 0 0 100 100)
function slicePoints(topT: number, botT: number): string {
  return `${leftX(topT)},${topT * 100} ${rightX(topT)},${topT * 100} ${rightX(botT)},${botT * 100} ${leftX(botT)},${botT * 100}`;
}

// Float animation variety per node
const FLOAT_DURATIONS = [
  3.2, 3.8, 4.1, 3.5, 4.4, 3.0, 3.7, 4.2, 3.3, 4.0, 3.6, 3.9, 4.3, 3.4,
];
const FLOAT_OFFSETS = [-6, -5, -7, -4, -6, -5, -7, -6, -5, -8, -4, -6, -5, -7];

// ─── Node component (exact same motion as old constellation) ───────────────────

interface NodeItemProps {
  tech: Tech;
  x: number;
  y: number;
  nodeIdx: number;
  isHovered: boolean;
  onHover: (key: string | null) => void;
  hoverKey: string;
}

function NodeItem({
  tech,
  x,
  y,
  nodeIdx,
  isHovered,
  onHover,
  hoverKey,
}: NodeItemProps) {
  const floatDur = FLOAT_DURATIONS[nodeIdx % FLOAT_DURATIONS.length];
  const floatY = FLOAT_OFFSETS[nodeIdx % FLOAT_OFFSETS.length];

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        marginLeft: -28,
        marginTop: -28,
        width: 56,
        height: 56,
        zIndex: 20,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: nodeIdx * 0.06 }}
      onMouseEnter={() => onHover(hoverKey)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Inner div: float animation + hover scale (same as old constellation) */}
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center cursor-default gap-1"
        animate={{
          y: [0, floatY, 0],
          scale: isHovered ? 1.25 : 1,
        }}
        transition={{
          y: {
            duration: floatDur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: nodeIdx * 0.4,
          },
          scale: { duration: 0.2 },
        }}
        style={{
          filter: isHovered
            ? "drop-shadow(0 0 8px rgba(138,180,255,0.6))"
            : "none",
        }}
      >
        <Image
          src={tech.icon}
          alt={tech.label}
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
          draggable={false}
        />
        <span
          className={`text-[9px] font-medium whitespace-nowrap transition-colors duration-200 ${
            isHovered ? "text-foreground" : "text-foreground/45"
          }`}
        >
          {tech.label}
        </span>

        {/* Tooltip on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -top-8 left-1/2 z-30 rounded-md bg-card/95 border border-border/40 backdrop-blur-sm px-2 py-0.5 shadow-lg"
              style={{ transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
            >
              <span className="text-[10px] font-semibold text-foreground whitespace-nowrap">
                {tech.desc}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function FullStackArchitecture() {
  const [hovered, setHovered] = useState<string | null>(null);

  // Flatten all nodes with a global index for animation staggering
  let globalIdx = 0;

  return (
    <div className="relative w-full max-w-[520px] aspect-square select-none overflow-visible">
      {/* SVG: pyramid slice backgrounds + gaps arrows */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="feFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="apiFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="beFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.08" />
          </linearGradient>
          <filter id="sliceGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
          </filter>
        </defs>

        {/* Slice backgrounds (trapezoids forming a pyramid) */}
        {SLICES.map((slice, i) => (
          <motion.polygon
            key={slice.label}
            points={slicePoints(slice.topT, slice.botT)}
            fill={`url(#${slice.fillId})`}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          />
        ))}

        {/* Bi-directional arrows in gaps */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <GapArrows cy={32} color={SLICES[1].accentColor} />
          <GapArrows cy={68} color={SLICES[2].accentColor} />
        </motion.g>
      </svg>

      {/* Layer labels */}
      {SLICES.map((slice) => {
        const labelT = slice.botT - 0.05;
        const labelX = leftX(labelT) + 1.5;
        return (
          <motion.div
            key={`label-${slice.label}`}
            className="absolute pointer-events-none"
            style={{
              left: `${labelX}%`,
              top: `${labelT * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <span
              className="text-[9px] font-bold uppercase tracking-[0.18em] opacity-50"
              style={{ color: slice.accentColor }}
            >
              {slice.label}
            </span>
          </motion.div>
        );
      })}

      {/* Tech nodes */}
      {SLICES.map((slice) =>
        slice.nodes.map((node) => {
          const tech = TECH[node.techId];
          const key = `${slice.label}-${node.techId}`;
          const idx = globalIdx++;
          return (
            <NodeItem
              key={key}
              tech={tech}
              x={node.x}
              y={node.y}
              nodeIdx={idx}
              isHovered={hovered === key}
              onHover={setHovered}
              hoverKey={key}
            />
          );
        }),
      )}
    </div>
  );
}

// ─── Animated bi-directional arrows in pyramid gaps ────────────────────────────

function GapArrows({ cy, color }: { cy: number; color: string }) {
  return (
    <>
      {/* Down arrow */}
      <motion.g
        animate={{ opacity: [0.2, 0.65, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <line
          x1="48"
          y1={cy - 2.5}
          x2="48"
          y2={cy + 0.5}
          stroke={color}
          strokeWidth="0.3"
          opacity="0.5"
        />
        <polygon
          points={`46.5,${cy + 0.5} 49.5,${cy + 0.5} 48,${cy + 2.5}`}
          fill={color}
          opacity="0.5"
        />
      </motion.g>

      {/* Up arrow */}
      <motion.g
        animate={{ opacity: [0.2, 0.65, 0.2] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.1,
        }}
      >
        <polygon
          points={`50.5,${cy - 2.5} 53.5,${cy - 2.5} 52,${cy - 4.5}`}
          fill={color}
          opacity="0.5"
        />
        <line
          x1="52"
          y1={cy - 2.5}
          x2="52"
          y2={cy + 0.5}
          stroke={color}
          strokeWidth="0.3"
          opacity="0.5"
        />
      </motion.g>
    </>
  );
}

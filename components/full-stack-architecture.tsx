"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// ─── Technology Stack ──────────────────────────────────────────────────────────

interface TechNode {
  id: string;
  label: string;
  icon: string;
  layer: "frontend" | "api" | "backend";
}

const TECH_STACK: TechNode[] = [
  // Frontend Layer
  { id: "react", label: "React", icon: "/hero/React.png", layer: "frontend" },
  {
    id: "nextjs",
    label: "Next.js",
    icon: "/hero/next-js.png",
    layer: "frontend",
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    icon: "/hero/tailwind.png",
    layer: "frontend",
  },

  // API Layer
  {
    id: "typescript",
    label: "TypeScript",
    icon: "/hero/typescript.png",
    layer: "api",
  },
  { id: "express", label: "Express", icon: "/hero/express.png", layer: "api" },

  // Backend Layer
  {
    id: "nodejs",
    label: "Node.js",
    icon: "/hero/nodejs.png",
    layer: "backend",
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    icon: "/hero/postgreSQL.png",
    layer: "backend",
  },
  { id: "prisma", label: "Prisma", icon: "/hero/prisma.png", layer: "backend" },
  { id: "aws", label: "AWS", icon: "/hero/AWS.png", layer: "backend" },
];

// ─── Layer Configuration ──────────────────────────────────────────────────────

interface LayerConfig {
  title: string;
  description: string;
  y: number;
}

const LAYERS: Record<string, LayerConfig> = {
  frontend: {
    title: "Frontend",
    description: "User Interface & Experience",
    y: 60,
  },
  api: {
    title: "API Layer",
    description: "Business Logic & Integration",
    y: 240,
  },
  backend: {
    title: "Backend & Database",
    description: "Data Storage & Services",
    y: 420,
  },
};

// ─── Individual Tech Node ──────────────────────────────────────────────────────

interface TechNodeComponentProps {
  tech: TechNode;
  x: number;
  y: number;
}

function TechNodeComponent({ tech, x, y }: TechNodeComponentProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: y + 20 }}
      animate={{ opacity: 1, y: y }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Breathing animation container */}
      <motion.g
        animate={
          isHovered
            ? { y: [0, -4, 0], scale: 1.15 }
            : { y: [0, -3, 0], scale: 1 }
        }
        transition={{
          duration: isHovered ? 0.3 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Background circle */}
        <circle
          cx={x}
          cy={y}
          r={28}
          fill="var(--color-card)"
          stroke="var(--color-accent)"
          strokeWidth={isHovered ? 2 : 1}
          opacity={isHovered ? 0.6 : 0.3}
        />

        {/* Glow effect on hover */}
        {isHovered && (
          <circle
            cx={x}
            cy={y}
            r={28}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={1}
            opacity={0.2}
          >
            <animate
              attributeName="r"
              from="28"
              to="40"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.4"
              to="0"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Icon container */}
        <g>
          <image
            x={x - 18}
            y={y - 18}
            width={36}
            height={36}
            href={tech.icon}
            opacity={isHovered ? 1 : 0.8}
          />
        </g>
      </motion.g>

      {/* Tooltip on hover */}
      {isHovered && (
        <g>
          <rect
            x={x - 35}
            y={y - 55}
            width={70}
            height={32}
            rx={6}
            fill="var(--color-card)"
            stroke="var(--color-accent)"
            strokeWidth={1}
            opacity={0.95}
          />
          <text
            x={x}
            y={y - 32}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-accent)"
            fontSize="12"
            fontWeight="500"
            fontFamily="var(--font-sans)"
          >
            {tech.label}
          </text>
        </g>
      )}
    </motion.g>
  );
}

// ─── Full Stack Architecture Component ──────────────────────────────────────────

export default function FullStackArchitecture() {
  const frontendTechs = TECH_STACK.filter((t) => t.layer === "frontend");
  const apiTechs = TECH_STACK.filter((t) => t.layer === "api");
  const backendTechs = TECH_STACK.filter((t) => t.layer === "backend");

  // Calculate positions for nodes (centered horizontally, spread across layers)
  const svgWidth = 500;
  const svgHeight = 550;

  const getNodePositions = (
    techs: TechNode[],
    y: number,
  ): Array<{ tech: TechNode; x: number; y: number }> => {
    const nodeRadius = 28;
    const spacing = nodeRadius * 2.2;
    const totalWidth = spacing * techs.length;
    const startX = (svgWidth - totalWidth) / 2 + nodeRadius;

    return techs.map((tech, idx) => ({
      tech,
      x: startX + idx * spacing,
      y,
    }));
  };

  const frontendPositions = getNodePositions(
    frontendTechs,
    LAYERS.frontend.y,
  );
  const apiPositions = getNodePositions(apiTechs, LAYERS.api.y);
  const backendPositions = getNodePositions(
    backendTechs,
    LAYERS.backend.y,
  );

  const allPositions = [
    ...frontendPositions,
    ...apiPositions,
    ...backendPositions,
  ];

  return (
    <div className="flex justify-center">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="drop-shadow-lg"
        style={{
          "--color-card": "hsl(var(--card))",
          "--color-accent": "hsl(var(--accent))",
          "--color-foreground": "hsl(var(--foreground))",
          "--font-sans": "var(--font-sans)",
        } as React.CSSProperties}
      >
        {/* Connecting lines from Frontend to API */}
        {frontendPositions.map((front, idx) => {
          const apiNode = apiPositions[Math.min(idx, apiPositions.length - 1)];
          return (
            <motion.line
              key={`fe-api-${idx}`}
              x1={front.x}
              y1={front.y + 28}
              x2={apiNode.x}
              y2={apiNode.y - 28}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity={0.2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
          );
        })}

        {/* Connecting lines from API to Backend */}
        {apiPositions.map((api, idx) => {
          const backendNode = backendPositions[
            Math.min(idx, backendPositions.length - 1)
          ];
          return (
            <motion.line
              key={`api-backend-${idx}`}
              x1={api.x}
              y1={api.y + 28}
              x2={backendNode.x}
              y2={backendNode.y - 28}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity={0.2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            />
          );
        })}

        {/* Layer labels and descriptions */}
        {Object.entries(LAYERS).map(([key, layer]) => (
          <motion.g
            key={`layer-label-${key}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <text
              x={20}
              y={layer.y - 5}
              fill="var(--color-accent)"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-sans)"
              opacity={0.7}
            >
              {layer.title}
            </text>
            <text
              x={20}
              y={layer.y + 12}
              fill="var(--color-foreground)"
              fontSize="11"
              fontFamily="var(--font-sans)"
              opacity={0.5}
            >
              {layer.description}
            </text>
          </motion.g>
        ))}

        {/* Render all tech nodes */}
        {allPositions.map(({ tech, x, y }) => (
          <TechNodeComponent key={tech.id} tech={tech} x={x} y={y} />
        ))}
      </svg>
    </div>
  );
}

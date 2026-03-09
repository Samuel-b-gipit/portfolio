"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import ParticleScene from "./3d/particle-scene";
import TechConstellation from "@/components/tech-constellation";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TERMINAL_COMMANDS: Record<string, string> = {
  help: `Available commands:
  about    — who I am
  skills   — tech stack
  projects — featured work
  contact  — get in touch
  clear    — clear terminal`,
  about: `I'm Samuel Gipit, a mid-level software engineer
specializing in enterprise HR systems and scalable
full-stack web applications. Built payroll,
recruitment, and contract systems used by 17K+ users.`,
  skills: `Frontend  : React · Next.js · TypeScript · Tailwind
Backend   : Node.js · Express · Prisma
Database  : PostgreSQL
Cloud     : Vercel · Supabase · Docker
Concepts  : REST APIs · Auth · Workflow Architecture`,
  projects: `[1] AI-Assisted Workflow Builder
    → Next.js, OpenAI API, PostgreSQL
[2] Full-Stack SaaS Starter Platform
    → Next.js, Stripe, PostgreSQL
[3] Contract Versioning System
    → Node.js, Prisma, Express
[4] Reverse Hiring App
    → Next.js, PostgreSQL, Tailwind`,
  contact: `Email   : samuelgipit@gmail.com
LinkedIn: linkedin.com/in/samuelgipit/
GitHub  : github.com`,
};

// ─── Interactive Terminal ──────────────────────────────────────────────────────

type TerminalLine = { type: "input" | "output"; text: string };

function InteractiveTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booting, setBooting] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Boot typewriter animation
  useEffect(() => {
    const bootMsg =
      "Welcome to Samuel's portfolio. Type 'help' to get started.";
    let i = 0;
    const id = setInterval(() => {
      i++;
      setLines([{ type: "output", text: bootMsg.slice(0, i) }]);
      if (i >= bootMsg.length) {
        clearInterval(id);
        setBooting(false);
      }
    }, 22);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll within terminal only — no page scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [lines]);

  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    const lower = trimmed.toLowerCase();
    if (!trimmed) return;

    setCmdHistory((prev) => [trimmed, ...prev]);
    setHistIdx(-1);

    if (lower === "clear") {
      setLines([]);
      setInputValue("");
      return;
    }

    const responseStr = TERMINAL_COMMANDS[lower];
    const responseLines: TerminalLine[] = responseStr
      ? responseStr
          .split("\n")
          .map((t) => ({ type: "output" as const, text: t }))
      : [
          {
            type: "output",
            text: `Command not found: '${trimmed}'. Type 'help'.`,
          },
        ];

    setLines((prev) => [
      ...prev,
      { type: "input", text: `$ ${trimmed}` },
      ...responseLines,
    ]);
    setInputValue("");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(inputValue);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
      if (newIdx >= 0 && cmdHistory[newIdx] !== undefined) {
        setHistIdx(newIdx);
        setInputValue(cmdHistory[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        const newIdx = histIdx - 1;
        setHistIdx(newIdx);
        setInputValue(cmdHistory[newIdx]);
      } else if (histIdx === 0) {
        setHistIdx(-1);
        setInputValue("");
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden font-mono text-sm shadow-xl shadow-primary/5">
      {/* macOS title bar */}
      <div className="relative flex items-center px-4 py-2.5 border-b border-border bg-muted/40">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-muted-foreground text-xs pointer-events-none">
          samuel@portfolio: ~
        </span>
      </div>

      {/* Terminal output area */}
      <div
        ref={scrollContainerRef}
        className="h-60 overflow-y-auto p-4 space-y-0.5 cursor-text select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`leading-relaxed whitespace-pre-wrap wrap-break-word ${
              line.type === "input"
                ? "text-accent font-medium"
                : "text-foreground/75"
            }`}
          >
            {line.text || "\u00A0"}
          </div>
        ))}

        {/* Live input line with blinking cursor */}
        {!booting && (
          <div className="flex items-center text-primary leading-relaxed">
            <span className="mr-1.5 text-primary/60">$</span>
            <span>{inputValue}</span>
            <span className="inline-block w-1.5 h-[1em] bg-primary ml-0.5 animate-pulse" />
          </div>
        )}
      </div>

      {/* Visually hidden real input for keyboard capture */}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          if (!booting) setInputValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className="sr-only"
        autoFocus
        aria-label="Terminal input"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-linear-to-br from-background via-background to-primary/10">
      {/* 3D particle background */}
      <div className="absolute inset-0 -z-10">
        <Canvas className="h-full w-full">
          <Suspense fallback={null}>
            <ParticleScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Two-column content */}
      <div className="flex h-full items-center justify-center px-6 py-20 lg:px-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── LEFT: Photo + skill constellation ── */}
          <div className="order-2 lg:order-1 flex justify-center">
            <TechConstellation />
          </div>

          {/* ── RIGHT: Heading + terminal + CTAs ── */}
          <motion.div
            className="order-1 lg:order-2 flex flex-col gap-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <div className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                Mid-Level Software Engineer
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-4xl font-bold leading-tight text-balance md:text-5xl">
                Building Systems{" "}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  That Scale
                </span>
              </h1>
              <p className="mt-3 text-foreground/60 text-base">
                Enterprise HR · Full-stack SaaS · Workflow Architecture
              </p>
            </div>

            {/* Interactive terminal */}
            <InteractiveTerminal />

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="#projects"
                className="rounded-lg bg-primary px-7 py-3 font-medium text-primary-foreground text-center transition-all hover:shadow-lg hover:shadow-primary/40"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                View My Work
              </motion.a>
              <motion.a
                href="#contact"
                className="rounded-lg border border-accent px-7 py-3 font-medium text-accent text-center transition-all hover:bg-accent/10"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Get In Touch
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="h-6 w-6 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import ParticleScene from "./3d/particle-scene";
import FullStackArchitecture from "@/components/fullstack-architecture";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";

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

function InteractiveTerminal({ boot }: { boot?: boolean }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booting, setBooting] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Accept boot prop
  useEffect(() => {
    if (!boot) return;
    const bootMsg =
      "Welcome to Samuel's portfolio. Type 'help' to get started or use the chat bot.";
    let i = 0;
    const id = setInterval(() => {
      i++;
      setLines([{ type: "output", text: bootMsg.slice(0, i) }]);
      if (i >= bootMsg.length) {
        clearInterval(id);
        setBooting(false);
      }
    }, 18);
    return () => clearInterval(id);
  }, [boot]);

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
    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden font-mono text-sm shadow-2xl shadow-primary/5">
      {/* Title bar */}
      <div className="relative flex items-center px-4 py-2.5 border-b border-border/30 bg-card/80">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_6px_#ff5f5740]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_6px_#febc2e40]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_6px_#28c84040]" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-muted-foreground/60 text-xs pointer-events-none tracking-wide">
          samuel@portfolio: ~
        </span>
      </div>

      {/* Terminal output */}
      <div
        ref={scrollContainerRef}
        className="h-56 overflow-y-auto p-4 space-y-0.5 cursor-text select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`leading-relaxed whitespace-pre-wrap wrap-break-word ${
              line.type === "input"
                ? "text-accent font-medium"
                : "text-foreground/70"
            }`}
          >
            {line.text || "\u00A0"}
          </div>
        ))}

        {!booting && (
          <div className="flex items-center text-accent leading-relaxed">
            <span className="mr-1.5 text-accent/50">$</span>
            <span>{inputValue}</span>
            <span className="inline-block w-1.5 h-[1em] bg-accent ml-0.5 animate-pulse rounded-sm" />
          </div>
        )}
      </div>

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

// ─── Typewriter Heading ────────────────────────────────────────────────────────

const TW_NAME = "Samuel Gipit";
const TW_TITLE = "Software Engineer";
const TW_HEADING1 = "Building Systems";
const TW_HEADING2 = "That Scale";

const TYPE_SPEED = 37;
const DEL_SPEED = 22;
const PAUSE_MS = 900;
const START_DELAY = 850;

type AnimPhase =
  | "idle"
  | "typing-name"
  | "typing-title"
  | "pause"
  | "deleting-title"
  | "deleting-name"
  | "typing-heading1"
  | "typing-heading2"
  | "done";

function TypewriterHeading({ onDone }: { onDone?: () => void }) {
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [cursorOn, setCursorOn] = useState(true);

  // Accept onDone prop
  // Kick off after initial fade-in
  useEffect(() => {
    const id = setTimeout(() => setPhase("typing-name"), START_DELAY);
    return () => clearTimeout(id);
  }, []);

  // Blink cursor only during reading pause
  useEffect(() => {
    if (phase === "pause") {
      const id = setInterval(() => setCursorOn((v) => !v), 530);
      return () => clearInterval(id);
    }
    setCursorOn(true);
  }, [phase]);

  // State machine
  useEffect(() => {
    if (phase === "idle" || phase === "done") return;
    let id: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing-name": {
        if (line1.length < TW_NAME.length) {
          id = setTimeout(
            () => setLine1(TW_NAME.slice(0, line1.length + 1)),
            TYPE_SPEED,
          );
        } else {
          id = setTimeout(() => setPhase("typing-title"), 150);
        }
        break;
      }
      case "typing-title": {
        if (line2.length < TW_TITLE.length) {
          id = setTimeout(
            () => setLine2(TW_TITLE.slice(0, line2.length + 1)),
            TYPE_SPEED,
          );
        } else {
          setPhase("pause");
        }
        break;
      }
      case "pause": {
        id = setTimeout(() => setPhase("deleting-title"), PAUSE_MS);
        break;
      }
      case "deleting-title": {
        if (line2.length > 0) {
          id = setTimeout(() => setLine2((s) => s.slice(0, -1)), DEL_SPEED);
        } else {
          id = setTimeout(() => setPhase("deleting-name"), 100);
        }
        break;
      }
      case "deleting-name": {
        if (line1.length > 0) {
          id = setTimeout(() => setLine1((s) => s.slice(0, -1)), DEL_SPEED);
        } else {
          id = setTimeout(() => setPhase("typing-heading1"), 150);
        }
        break;
      }
      case "typing-heading1": {
        if (line1.length < TW_HEADING1.length) {
          id = setTimeout(
            () => setLine1(TW_HEADING1.slice(0, line1.length + 1)),
            TYPE_SPEED,
          );
        } else {
          id = setTimeout(() => setPhase("typing-heading2"), 150);
        }
        break;
      }
      case "typing-heading2": {
        if (line2.length < TW_HEADING2.length) {
          id = setTimeout(
            () => setLine2(TW_HEADING2.slice(0, line2.length + 1)),
            TYPE_SPEED,
          );
        } else {
          setPhase("done");
          if (onDone) onDone();
        }
        break;
      }
      default:
        break;
    }

    return () => clearTimeout(id);
  }, [phase, line1, line2, onDone]);

  const isIntroPhase = [
    "idle",
    "typing-name",
    "typing-title",
    "pause",
    "deleting-title",
    "deleting-name",
  ].includes(phase);
  const cursorOnLine2 = [
    "typing-title",
    "pause",
    "deleting-title",
    "typing-heading2",
  ].includes(phase);
  const showCursor = phase !== "idle" && phase !== "done";
  const isGradientLine2 = ["typing-heading2", "done"].includes(phase);

  const cursor = showCursor ? (
    cursorOn ? (
      <span className="text-primary font-thin select-none" aria-hidden="true">
        |
      </span>
    ) : (
      <span className="invisible select-none" aria-hidden="true">
        |
      </span>
    )
  ) : null;

  if (isIntroPhase) {
    return (
      <h1 className="text-display">
        <span className="block">
          {line1}
          {!cursorOnLine2 && cursor}
        </span>
        <span
          className="block whitespace-nowrap"
          style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.4rem)" }}
        >
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            {line2 || "\u00A0"}
          </span>
          {cursorOnLine2 && cursor}
        </span>
      </h1>
    );
  }

  return (
    <h1 className="text-display">
      <span className="block">
        {line1}
        {!cursorOnLine2 && cursor}
      </span>
      <span className="block">
        <span
          className={
            isGradientLine2
              ? "bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
              : ""
          }
        >
          {line2 || "\u00A0"}
        </span>
        {cursorOnLine2 && cursor}
      </span>
    </h1>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [terminalReady, setTerminalReady] = useState(false);
  const terminalDelayRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeout if unmounted
  useEffect(() => {
    return () => {
      if (terminalDelayRef.current) clearTimeout(terminalDelayRef.current);
    };
  }, []);

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* 3D particle background */}
      <div className="absolute inset-0 -z-10">
        <Canvas className="h-full w-full">
          <Suspense fallback={null}>
            <ParticleScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 -z-5 bg-linear-to-t from-background/80 via-transparent to-transparent" />
      <div className="absolute inset-0 -z-5 bg-linear-to-r from-background/30 via-transparent to-transparent" />

      {/* Two-column content — Left: content, Right: constellation */}
      <div className="flex h-full items-center justify-center px-6 py-20 lg:px-12">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* ── LEFT: Heading + terminal + CTAs ── */}
          <motion.div
            className="order-1 flex flex-col gap-5"
            variants={staggerContainer(0.12, 0.2)}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div className="inline-flex" variants={fadeInUp}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/8 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Mid-Level Software Engineer
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeInUp}>
              <div
                style={{
                  height: "calc(clamp(2.5rem, 5vw, 4.5rem) * 1.05 * 2)",
                  overflow: "visible",
                }}
              >
                <TypewriterHeading
                  onDone={() => {
                    terminalDelayRef.current = setTimeout(
                      () => setTerminalReady(true),
                      3500,
                    );
                  }}
                />
              </div>
              <p className="mt-4 text-lg text-foreground/55 max-w-lg leading-relaxed">
                Enterprise HR &middot; Full-stack SaaS &middot; Workflow
                Architecture
              </p>
            </motion.div>

            {/* Interactive terminal */}
            <motion.div variants={fadeInUp}>
              <InteractiveTerminal boot={terminalReady} />
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              variants={fadeInUp}
            >
              <motion.a
                href="#projects"
                className="rounded-xl px-7 py-3 font-medium text-primary-foreground text-center transition-all"
                style={{ background: "var(--gradient-cta)" }}
                whileHover={{ scale: 1.03, boxShadow: "var(--glow-primary)" }}
                whileTap={{ scale: 0.97 }}
              >
                View My Work
              </motion.a>
              <motion.a
                href="#contact"
                className="rounded-xl border border-accent/30 bg-accent/5 backdrop-blur-sm px-7 py-3 font-medium text-accent text-center transition-all hover:bg-accent/10 hover:border-accent/50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get In Touch
              </motion.a>
              <motion.a
                href="/resume.pdf"
                download
                className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm px-5 py-3 font-medium text-foreground/60 text-center transition-all hover:text-foreground hover:border-border/60 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download className="h-4 w-4" />
                Resume
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Full-stack architecture diagram ── */}
          <div className="order-2 hidden lg:flex justify-center">
            <FullStackArchitecture />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs text-foreground/30 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}

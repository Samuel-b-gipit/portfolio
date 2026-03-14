import type { Variants, Transition } from "framer-motion";

// ─── Spring Configs ─────────────────────────────────────────────────────

export const springs = {
  gentle: { type: "spring", stiffness: 120, damping: 20 } as Transition,
  snappy: { type: "spring", stiffness: 300, damping: 30 } as Transition,
  bouncy: { type: "spring", stiffness: 400, damping: 15 } as Transition,
};

// ─── Viewport Trigger Config ─────────────────────────────────────────────

export const viewportConfig = {
  once: true,
  margin: "-80px",
};

// ─── Fade Variants ─────────────────────────────────────────────────────

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// ─── Scale Variants ─────────────────────────────────────────────────────

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Stagger Containers ─────────────────────────────────────────────────

export const staggerContainer = (
  staggerDelay = 0.1,
  delayChildren = 0,
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

// ─── Section Header ─────────────────────────────────────────────────────

export const sectionHeader: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Card Variants ─────────────────────────────────────────────────────

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Glow Pulse ─────────────────────────────────────────────────────────

export const glowPulse: Variants = {
  idle: {
    boxShadow: "0 0 20px oklch(0.65 0.25 275 / 0.1)",
  },
  glow: {
    boxShadow: [
      "0 0 20px oklch(0.65 0.25 275 / 0.1)",
      "0 0 40px oklch(0.65 0.25 275 / 0.25)",
      "0 0 20px oklch(0.65 0.25 275 / 0.1)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

// ─── Nav Item ─────────────────────────────────────────────────────────

export const navItem: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ─── Mobile Menu ─────────────────────────────────────────────────────

export const mobileMenuOverlay: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

export const mobileMenuItem: Variants = {
  closed: { opacity: 0, x: 30 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

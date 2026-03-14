"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Moon,
  Sun,
  X,
  Github,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";
import {
  staggerContainer,
  navItem,
  mobileMenuOverlay,
  mobileMenuItem,
} from "@/lib/animation-variants";

const NAV_LINKS = [
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const SOCIALS = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:samuelgipit@gmail.com", label: "Email" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll tracking: background + progress bar + active section
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 50);

    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docHeight > 0 ? scrollY / docHeight : 0);

    // Scroll-spy: find the section closest to the top
    const sections = NAV_LINKS.map((l) => l.href.slice(1));
    let current = "";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = id;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="hidden sm:inline">Samuel Gipit</span>
            <span className="sm:hidden">SG</span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <motion.div
              className="flex items-center gap-1"
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="visible"
            >
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-lg"
                    variants={navItem}
                    whileHover={{ scale: 1.02 }}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-linear-to-r from-primary to-accent"
                        layoutId="nav-indicator"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.a>
                );
              })}

              {/* Theme toggle */}
              {mounted && (
                <motion.button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="relative ml-2 rounded-full p-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all overflow-hidden"
                  variants={navItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9, rotate: 15 }}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-4.5 w-4.5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: -90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-4.5 w-4.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* CTA */}
              <motion.a
                href="#contact"
                className="ml-3 rounded-full px-6 py-2 text-sm font-semibold text-primary-foreground transition-all"
                style={{ background: "var(--gradient-cta)" }}
                variants={navItem}
                whileHover={{ scale: 1.05, boxShadow: "var(--glow-primary)" }}
                whileTap={{ scale: 0.95 }}
              >
                Let&apos;s Talk
              </motion.a>
            </motion.div>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-1">
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-full text-foreground/70 hover:text-foreground transition-colors"
                whileTap={{ scale: 0.9, rotate: 15 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.div
                      key="sun-m"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon-m"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
            <motion.button
              className="p-2.5 flex items-center rounded-full hover:bg-muted/50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col bg-background/95 backdrop-blur-2xl"
            variants={mobileMenuOverlay}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-3xl font-bold text-foreground/80 hover:text-foreground transition-colors"
                  variants={mobileMenuItem}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ x: 8 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className="mt-4 rounded-full px-10 py-3 text-lg font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-cta)" }}
                variants={mobileMenuItem}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ delay: NAV_LINKS.length * 0.06 }}
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let&apos;s Talk
              </motion.a>
            </div>

            {/* Social links at bottom of mobile menu */}
            <motion.div
              className="flex justify-center gap-5 pb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-11 w-11 rounded-full border border-border/50 text-foreground/50 hover:text-accent hover:border-accent/50 transition-all"
                  aria-label={s.label}
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

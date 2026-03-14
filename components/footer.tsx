"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";

const NAV_LINKS = [
  { name: "Home", href: "/" },
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

const TECH_BADGES = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Three.js",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-transparent">
      {/* Gradient divider */}
      <div className="h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 pt-16 pb-8">
        <motion.div
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Brand */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-3 tracking-tight">
              Samuel Gipit
            </h3>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-60">
              Software Engineer specializing in enterprise systems, scalable
              full-stack applications, and workflow architecture.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-sm font-semibold text-foreground/80 mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-foreground/50 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-sm font-semibold text-foreground/80 mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3 flex-wrap">
              {SOCIALS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-xl border border-border/50 bg-card/30 text-foreground/50 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-4.5 w-4.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Built With */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-sm font-semibold text-foreground/80 mb-4 uppercase tracking-wider">
              Built With
            </h4>
            <div className="flex flex-wrap gap-2">
              {TECH_BADGES.map((tech) => (
                <span
                  key={tech}
                  className="inline-block rounded-full bg-primary/8 border border-primary/10 px-3 py-1 text-xs font-medium text-foreground/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/30">
          <p className="text-center text-foreground/35 text-xs">
            &copy; {currentYear} Samuel Gipit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

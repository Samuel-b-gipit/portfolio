"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid gap-8 md:grid-cols-3 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Samuel Gipit
            </h3>
            <p className="text-foreground/60 text-sm">Software Engineer</p>
          </motion.div>

          {/* Links */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            <motion.a
              href="/"
              className="text-foreground/60 hover:text-accent transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              Home
            </motion.a>
            <motion.a
              href="#projects"
              className="text-foreground/60 hover:text-accent transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              Projects
            </motion.a>
            <motion.a
              href="#about"
              className="text-foreground/60 hover:text-accent transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              About
            </motion.a>
            <motion.a
              href="#contact"
              className="text-foreground/60 hover:text-accent transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              Contact
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center md:justify-end gap-4"
          >
            {[
              { icon: Github, href: "https://github.com", label: "GitHub" },
              {
                icon: Linkedin,
                href: "https://linkedin.com",
                label: "LinkedIn",
              },
              { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-full border border-border bg-card/50 text-foreground/60 hover:text-accent hover:border-accent/50 transition-all"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="my-8 border-t border-border/50" />

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="text-center text-foreground/50 text-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p>
            © {currentYear} Samuel Gipit. All rights reserved. • Built with
            Next.js, React Three Fiber &amp; Framer Motion
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

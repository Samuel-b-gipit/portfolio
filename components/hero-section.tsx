"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { motion } from "framer-motion";
import ParticleScene from "./3d/particle-scene";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas className="h-full w-full">
          <Suspense fallback={null}>
            <ParticleScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="flex h-full items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Mid-Level Software Engineer
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold text-balance md:text-7xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Samuel{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gipit
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-2xl text-lg text-foreground/70 text-balance md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Building enterprise-grade HR systems and scalable full-stack
            applications with a focus on data integrity, workflow architecture,
            and performance.
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.a
              href="#projects"
              className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              className="rounded-lg border border-accent px-8 py-3 font-medium text-accent transition-all hover:bg-accent/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
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

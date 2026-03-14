"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import {
  staggerContainer,
  fadeInUp,
  sectionHeader,
} from "@/lib/animation-variants";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Samuel's ability to architect complex workflow systems is exceptional. His work on the PSB hiring system streamlined our entire approval process across 50+ departments.",
    name: "Department Head",
    title: "Division Chief",
    company: "Local Government Unit",
    initials: "DH",
  },
  {
    quote:
      "The payroll system Samuel built handles multi-step calculations with precision. His attention to data integrity and audit logging gave us confidence in every computation.",
    name: "Project Stakeholder",
    title: "HR Systems Manager",
    company: "Local Government Unit",
    initials: "PS",
  },
  {
    quote:
      "Working with Samuel on the contract versioning system was impressive. He implemented concurrency safeguards that prevented duplicate issuance across concurrent sessions.",
    name: "Technical Lead",
    title: "Senior Developer",
    company: "Development Team",
    initials: "TL",
  },
  {
    quote:
      "Samuel consistently delivers clean, maintainable code. His full-stack expertise — from React frontends to PostgreSQL backends — makes him a versatile and reliable engineer.",
    name: "Team Colleague",
    title: "Software Engineer",
    company: "Development Team",
    initials: "TC",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused || !inView) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [isPaused, inView, next]);

  const testimonial = TESTIMONIALS[current];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 px-6 md:py-32 md:px-8 lg:px-12 bg-background"
    >
      <div className="mx-auto max-w-4xl relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          {/* Header */}
          <motion.div className="mb-16 text-center" variants={sectionHeader}>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="text-h2 text-balance mb-4">What People Say</h2>
            <p className="mx-auto max-w-2xl text-foreground/55 leading-relaxed">
              Feedback from colleagues, stakeholders, and collaborators on
              enterprise projects.
            </p>
          </motion.div>

          {/* Testimonial card */}
          <motion.div variants={fadeInUp}>
            <div
              className="relative rounded-3xl border border-border/30 bg-card/40 backdrop-blur-md p-8 md:p-12"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Quote icon */}
              <div className="absolute top-6 left-8 md:top-8 md:left-12">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-8"
                >
                  {/* Quote text */}
                  <blockquote className="text-lg md:text-xl leading-relaxed text-foreground/80 italic mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-foreground/50">
                        {testimonial.title} &middot; {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20">
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-8 bg-accent"
                          : "w-2 bg-foreground/20 hover:bg-foreground/40"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="flex items-center justify-center h-10 w-10 rounded-xl border border-border/30 text-foreground/50 hover:text-foreground hover:border-border/60 transition-all"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    className="flex items-center justify-center h-10 w-10 rounded-xl border border-border/30 text-foreground/50 hover:text-foreground hover:border-border/60 transition-all"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

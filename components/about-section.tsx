"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Heart, Zap, Shield, Users } from "lucide-react";
import {
  staggerContainer,
  fadeInUp,
  sectionHeader,
  cardVariants,
} from "@/lib/animation-variants";

interface Education {
  degree: string;
  school: string;
  period: string;
  description: string;
}

const EDUCATION: Education[] = [
  {
    degree: "Bachelor of Science in Information Technology",
    school: "University",
    period: "2020 – 2024",
    description:
      "Focused on software engineering, database systems, and web application development.",
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Data Integrity",
    description:
      "Every system I build prioritizes correctness — atomic constraints, concurrency safeguards, and audit trails.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Efficient queries, smart caching, and lean frontends that deliver sub-second experiences at scale.",
  },
  {
    icon: Users,
    title: "User-Centered",
    description:
      "Enterprise doesn't mean ugly. I design clear, intuitive interfaces for complex workflows.",
  },
  {
    icon: Heart,
    title: "Craft & Quality",
    description:
      "Clean architecture, readable code, and thoughtful abstractions that teams can maintain and extend.",
  },
];

const STATS = [
  { label: "Projects Completed", value: 6, suffix: "+" },
  { label: "Active Users Served", value: 17, suffix: "K+" },
  { label: "Years Experience", value: 2, suffix: "+" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-24 px-6 md:py-32 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          {/* Header */}
          <motion.div className="mb-12 text-center" variants={sectionHeader}>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Who I Am
            </p>
            <h2 className="text-h2 text-balance mb-4">About Me</h2>
            <p className="mx-auto max-w-2xl text-foreground/55 leading-relaxed">
              Mid-level Software Engineer with a focus on enterprise systems,
              data integrity, and scalable full-stack architecture.
            </p>
          </motion.div>

          {/* Bio + Values */}
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Bio */}
            <motion.div
              variants={fadeInUp}
              className="space-y-5 flex flex-col h-full"
            >
              <p className="text-base leading-relaxed text-foreground/75">
                I’m a mid-level Software Engineer focused on building full-stack
                web applications and designing reliable backend systems. I
                emphasize maintainable architecture, structured workflows, and
                strong data integrity to create scalable and dependable
                software.
              </p>
              {/* Education card */}
              <motion.div
                variants={cardVariants}
                className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 transition-all hover:border-accent/30 hover:bg-card/60 flex flex-col flex-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    Education
                  </h3>
                </div>
                {EDUCATION.map((edu) => (
                  <div key={edu.degree}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-foreground leading-snug text-sm">
                        {edu.degree}
                      </h4>
                      <span className="text-xs font-medium text-accent whitespace-nowrap px-2.5 py-1 rounded-full bg-accent/10">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/50 mb-2">
                      {edu.school}
                    </p>
                    <p className="text-sm text-foreground/65 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Values */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={staggerContainer(0.08)}
            >
              {VALUES.map((value) => (
                <motion.div
                  key={value.title}
                  variants={cardVariants}
                  className="rounded-2xl border border-border/30 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
                >
                  <value.icon className="h-5 w-5 text-accent mb-3" />
                  <h3 className="text-sm font-bold text-foreground mb-1.5">
                    {value.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-foreground/50">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats with animated counters */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 grid gap-6 sm:grid-cols-3"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/30 bg-card/40 p-6 text-center backdrop-blur-sm"
              >
                <div className="mb-2 text-4xl font-bold text-accent">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-foreground/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

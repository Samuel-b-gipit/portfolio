"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { Briefcase } from "lucide-react";
import {
  staggerContainer,
  fadeInUp,
  sectionHeader,
} from "@/lib/animation-variants";

interface Experience {
  title: string;
  system: string;
  company: string;
  period: string;
  current?: boolean;
  description: string;
  highlights: string[];
}

const EXPERIENCES: Experience[] = [
  {
    title: "Software Engineer",
    system: "Payroll Information System",
    company: "Local Government Unit",
    period: "2025 – Present",
    current: true,
    description:
      "Central payroll engine connecting all HRIS modules to generate accurate compensation reports.",
    highlights: [
      "Designed payroll calculation engine integrating position, salary grade, attendance, and benefit data",
      "Implemented validation rules to detect and prevent payroll discrepancies",
      "Integrated mandatory deductions and benefit computations across all employee types",
      "Built secure access layers for salary data visibility with audit-ready report generation",
    ],
  },
  {
    title: "Software Engineer",
    system: "Personnel Selection Board (PSB) System",
    company: "Local Government Unit",
    period: "2024 – 2025",
    description:
      "Enterprise hiring workflow system supporting department-level approval processes across the city government.",
    highlights: [
      "Designed configurable multi-step approval engine for department-level hiring workflows",
      "Implemented role-based access control for Admin, Reviewer, and Approver roles",
      "Built audit logging for complete decision traceability across all workflow transitions",
      "Applied optimistic locking to prevent race conditions in concurrent approvals",
      "Supported 17,000+ active users across city departments",
    ],
  },
  {
    title: "Software Engineer",
    system: "COS / Non-Plantilla Hiring & Contract Management",
    company: "Local Government Unit",
    period: "2024 – 2025",
    description:
      "Contract-based hiring workflow with bundled application processing and full contract lifecycle management.",
    highlights: [
      "Developed application bundling system for automated contract generation",
      "Enforced atomic uniqueness of contract numbers to prevent duplicate issuance",
      "Implemented contract versioning (v1, v2, v3…) with rollback support",
      "Designed lifecycle management: Draft → Pending → Approved → Archived",
      "Added concurrency safeguards and status-based validation constraints",
    ],
  },
  {
    title: "Software Engineer",
    system: "HRIS Dependency Modules",
    company: "Local Government Unit",
    period: "2024",
    description:
      "Core data libraries powering the HRIS ecosystem — Position Library and Salary Grade Management.",
    highlights: [
      "Designed versioned position catalog with historical salary reference consistency",
      "Linked position versions directly to payroll computation logic for accuracy",
      "Built salary grade mapping module with grade-based compensation computation",
      "Enforced validation rules for grade transitions across all HRIS modules",
    ],
  },
];

function TimelineCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div ref={ref} className="relative pl-16 sm:pl-20">
      {/* Dot */}
      <motion.div
        className="absolute left-0 top-3 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-primary/40 bg-card"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
      >
        <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        {experience.current && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
          </span>
        )}
      </motion.div>

      {/* Card */}
      <motion.div
        ref={cardRef}
        className="group rounded-2xl border border-border/30 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.15, duration: 0.5 }}
      >
        <div className="mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              {experience.system}
            </h3>
            <p className="text-sm text-primary font-medium mt-0.5">
              {experience.title} · {experience.company}
            </p>
          </div>
          <span
            className={`inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
              experience.current
                ? "bg-accent/15 text-accent border border-accent/25"
                : "bg-primary/10 text-primary/70 border border-primary/15"
            }`}
          >
            {experience.period}
          </span>
        </div>

        <p className="mb-4 text-foreground/55 leading-relaxed text-sm">
          {experience.description}
        </p>

        <ul className="space-y-2">
          {experience.highlights.map((highlight, hidx) => (
            <motion.li
              key={hidx}
              className="flex items-start gap-2.5 text-sm text-foreground/70"
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + hidx * 0.05, duration: 0.4 }}
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent/70 shrink-0" />
              <span>{highlight}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useSpring(
    useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]),
    {
      stiffness: 100,
      damping: 30,
    },
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative bg-background py-24 px-6 md:py-32 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          {/* Header */}
          <motion.div className="mb-12 text-center" variants={sectionHeader}>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Career
            </p>
            <h2 className="text-h2 text-balance mb-4">Experience</h2>
            <p className="mx-auto max-w-2xl text-foreground/55 leading-relaxed">
              Enterprise systems built for the Local Government Unit, serving
              thousands of employees across HR, payroll, and contract workflows.
            </p>
          </motion.div>

          <div className="relative space-y-8">
            {/* Animated timeline line */}
            <div className="absolute left-4.5 sm:left-5.5 top-0 bottom-0 w-px bg-border/30" />
            <motion.div
              className="absolute left-4.5 sm:left-5.5 top-0 w-px origin-top"
              style={{
                height: lineHeight,
                background:
                  "linear-gradient(to bottom, var(--color-primary), var(--color-accent))",
              }}
            />

            {EXPERIENCES.map((experience, idx) => (
              <TimelineCard
                key={experience.system}
                experience={experience}
                index={idx}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

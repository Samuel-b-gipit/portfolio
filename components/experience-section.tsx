"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Experience {
  title: string;
  system: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

const EXPERIENCES: Experience[] = [
  {
    title: "Software Engineer",
    system: "Payroll Information System",
    company: "Quezon City Government",
    period: "2025 – Present",
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
    company: "Quezon City Government",
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
    company: "Quezon City Government",
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
    company: "Quezon City Government",
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

export default function ExperienceSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="experience"
      className="relative bg-gradient-to-b from-background to-primary/5 py-20 px-4 md:py-32"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">
              Experience
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Enterprise systems built for the Quezon City Government, serving
              thousands of employees across HR, payroll, and contract workflows.
            </p>
          </motion.div>

          <div className="relative space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent" />

            {EXPERIENCES.map((experience, idx) => (
              <motion.div
                key={experience.system}
                variants={itemVariants}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <motion.div
                  className="absolute left-0 top-2 h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                >
                  <div className="h-4 w-4 rounded-full bg-background" />
                </motion.div>

                {/* Content Card */}
                <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-card/80">
                  <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground leading-snug">
                        {experience.system}
                      </h3>
                      <p className="text-sm text-primary font-medium mt-0.5">
                        {experience.title} · {experience.company}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-accent whitespace-nowrap">
                      {experience.period}
                    </span>
                  </div>

                  <p className="mb-4 text-foreground/70 leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {experience.highlights.map((highlight, hidx) => (
                      <motion.li
                        key={hidx}
                        className="flex items-start gap-3 text-foreground/80"
                        initial={{ opacity: 0, x: -10 }}
                        animate={
                          inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                        }
                        transition={{
                          delay: idx * 0.2 + hidx * 0.1,
                          duration: 0.5,
                        }}
                      >
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                        <span>{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  staggerContainer,
  fadeInUp,
  sectionHeader,
  cardVariants,
} from "@/lib/animation-variants";

interface Skill {
  name: string;
  icon: string;
  proficiency: number;
}

interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", icon: "⚛️", proficiency: 90 },
      { name: "Next.js", icon: "▲", proficiency: 90 },
      { name: "TypeScript", icon: "🔷", proficiency: 88 },
      { name: "Tailwind CSS", icon: "🎨", proficiency: 92 },
      { name: "HTML/CSS", icon: "🌐", proficiency: 95 },
      { name: "Framer Motion", icon: "✨", proficiency: 80 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", icon: "🟢", proficiency: 88 },
      { name: "Express", icon: "⚡", proficiency: 85 },
      { name: "PostgreSQL", icon: "🐘", proficiency: 85 },
      { name: "Prisma", icon: "🔺", proficiency: 82 },
      { name: "REST APIs", icon: "🔗", proficiency: 90 },
      { name: "GraphQL", icon: "◇", proficiency: 72 },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    skills: [
      { name: "AWS", icon: "☁️", proficiency: 70 },
      { name: "Vercel", icon: "▲", proficiency: 88 },
      { name: "Docker", icon: "🐳", proficiency: 68 },
      { name: "Supabase", icon: "⚡", proficiency: 78 },
      { name: "Git", icon: "🔀", proficiency: 90 },
      { name: "CI/CD", icon: "🔄", proficiency: 72 },
    ],
  },
  {
    id: "concepts",
    label: "Concepts",
    skills: [
      { name: "RBAC", icon: "🔐", proficiency: 90 },
      { name: "Optimistic Locking", icon: "🔒", proficiency: 85 },
      { name: "Concurrency Control", icon: "⚙️", proficiency: 82 },
      { name: "Transaction Mgmt", icon: "📋", proficiency: 85 },
      { name: "Versioning Systems", icon: "📊", proficiency: 88 },
      { name: "Audit Logging", icon: "📝", proficiency: 90 },
    ],
  },
];

function SkillBar({
  proficiency,
  inView,
}: {
  proficiency: number;
  inView: boolean;
}) {
  return (
    <div className="h-1.5 w-full rounded-full bg-border/50 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--gradient-cta)" }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${proficiency}%` } : { width: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  );
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("frontend");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const currentCategory = SKILL_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-24 px-6 md:py-32 md:px-8 lg:px-12"
      style={{ background: "var(--gradient-section-alt)" }}
    >
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 dark:opacity-15" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          {/* Section header */}
          <motion.div className="mb-16 text-center" variants={sectionHeader}>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Technical Expertise
            </p>
            <h2 className="text-h2 text-balance mb-4">
              Skills &amp; Technologies
            </h2>
            <p className="mx-auto max-w-2xl text-foreground/55 leading-relaxed">
              A comprehensive toolkit honed through building enterprise-scale
              systems, from frontend interfaces to backend architectures.
            </p>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            className="flex justify-center gap-2 mb-12 flex-wrap"
            variants={fadeInUp}
          >
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "text-primary-foreground"
                    : "text-foreground/60 hover:text-foreground hover:bg-card/50"
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "var(--gradient-cta)" }}
                    layoutId="skill-tab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Skill cards grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {currentCategory?.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={cardVariants}
                  className="group rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-accent/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg">{skill.icon}</span>
                    <span className="font-semibold text-foreground">
                      {skill.name}
                    </span>
                    <span className="ml-auto text-xs text-foreground/40 font-mono">
                      {skill.proficiency}%
                    </span>
                  </div>
                  <SkillBar proficiency={skill.proficiency} inView={inView} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

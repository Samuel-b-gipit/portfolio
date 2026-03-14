"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Star } from "lucide-react";
import {
  staggerContainer,
  fadeInUp,
  sectionHeader,
  cardVariants,
} from "@/lib/animation-variants";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  url: string;
  category: string;
  featured?: boolean;
  links: {
    github?: string;
    demo?: string;
  };
}

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI / ML" },
  { id: "saas", label: "SaaS" },
];

const PROJECTS: Project[] = [
  {
    title: "AI-Assisted Workflow Builder",
    description:
      "Intelligent workflow system that dynamically generates approval chains and validation logic based on organizational rules.",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "OpenAI API",
    ],
    category: "ai",
    featured: true,
    url: process.env.NEXT_PUBLIC_PROJECT_WORKFLOW_BUILDER_URL ?? "#",
    links: {
      github: process.env.NEXT_PUBLIC_PROJECT_WORKFLOW_BUILDER_URL,
    },
  },
  {
    title: "Full-Stack SaaS Starter Platform",
    description:
      "Production-ready SaaS foundation with JWT authentication, subscription billing, and modular REST API architecture.",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    technologies: [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS",
    ],
    category: "saas",
    featured: true,
    url: process.env.NEXT_PUBLIC_PROJECT_SAAS_STARTER_URL ?? "#",
    links: {
      github: process.env.NEXT_PUBLIC_PROJECT_SAAS_STARTER_URL,
    },
  },
  {
    title: "Contract Versioning System",
    description:
      "Standalone contract lifecycle management with version tracking, atomic uniqueness enforcement, and concurrency safeguards.",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    technologies: ["Node.js", "PostgreSQL", "Prisma", "Express"],
    category: "backend",
    url: process.env.NEXT_PUBLIC_PROJECT_CONTRACT_VERSIONING_URL ?? "#",
    links: {
      github: process.env.NEXT_PUBLIC_PROJECT_CONTRACT_VERSIONING_URL,
    },
  },
  {
    title: "Reverse Hiring App",
    description:
      "Employer-focused recruitment platform where employers browse applicant profiles and send proposals directly.",
    image: "/reverse-hiring.png",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    category: "fullstack",
    url: process.env.NEXT_PUBLIC_PROJECT_REVERSE_HIRING_URL ?? "#",
    links: {
      github: process.env.NEXT_PUBLIC_PROJECT_REVERSE_HIRING_URL,
    },
  },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-background py-24 px-6 md:py-32 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          {/* Header */}
          <motion.div className="mb-12 text-center" variants={sectionHeader}>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Portfolio
            </p>
            <h2 className="text-h2 text-balance mb-4">Featured Projects</h2>
            <p className="mx-auto max-w-2xl text-foreground/55 leading-relaxed">
              A selection of personal and side projects demonstrating full-stack
              architecture, workflow design, and scalable system patterns.
            </p>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            className="flex justify-center gap-2 mb-12 flex-wrap"
            variants={fadeInUp}
          >
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "text-primary-foreground"
                    : "text-foreground/60 hover:text-foreground hover:bg-card/50"
                }`}
              >
                {activeFilter === filter.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--gradient-cta)" }}
                    layoutId="project-filter"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Project grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="grid gap-6 md:grid-cols-2"
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.title}
                  variants={cardVariants}
                  layout
                  className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm flex flex-col transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-primary/5"
                >
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold text-accent-foreground">
                      <Star className="h-3 w-3" fill="currentColor" />
                      Featured
                    </div>
                  )}

                  {/* Image area */}
                  <div className="relative aspect-video overflow-hidden shrink-0">
                    {project.image.startsWith("/") ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{ background: project.image }}
                      />
                    )}
                    {/* Bottom fade */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-foreground/55 leading-relaxed text-sm mb-5 flex-1">
                      {project.description}
                    </p>

                    {/* Tech + links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-4 border-t border-border/20">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-block rounded-full bg-primary/8 border border-primary/10 px-2.5 py-0.5 text-xs font-medium text-foreground/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3 shrink-0">
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-accent transition-colors"
                          >
                            <Github className="h-4 w-4" />
                            <span>Code</span>
                          </a>
                        )}
                        {project.links.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-accent transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

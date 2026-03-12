"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  url: string;
  links: {
    github?: string;
    demo?: string;
  };
}

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
    url: process.env.NEXT_PUBLIC_PROJECT_REVERSE_HIRING_URL ?? "#",
    links: {
      github: process.env.NEXT_PUBLIC_PROJECT_REVERSE_HIRING_URL,
    },
  },
];

export default function ProjectsSection() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-background py-20 px-4 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">
              Featured Projects
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              A selection of personal and side projects demonstrating full-stack
              architecture, workflow design, and scalable system patterns.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project) => (
              <motion.a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="group overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm flex flex-col transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
              >
                {/* Top: Image panel */}
                <div className="relative h-48 overflow-hidden shrink-0">
                  {project.image.startsWith("/") ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: project.image }}
                    />
                  )}
                  {/* Fade to card bg at bottom edge */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card/70 to-transparent" />
                </div>

                {/* Bottom: Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-foreground/65 leading-relaxed text-sm mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Links + tech badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                    <div className="flex gap-4 shrink-0">
                      {project.links.github && (
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              project.links.github,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <Github className="h-5 w-5" />
                          <span>Code</span>
                        </motion.button>
                      )}
                      {project.links.demo && (
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              project.links.demo,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>Demo</span>
                        </motion.button>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

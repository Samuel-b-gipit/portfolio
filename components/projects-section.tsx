"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
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
    links: {
      github: "https://github.com",
      demo: "https://demo.example.com",
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
    links: {
      github: "https://github.com",
      demo: "https://demo.example.com",
    },
  },
  {
    title: "Contract Versioning System",
    description:
      "Standalone contract lifecycle management with version tracking, atomic uniqueness enforcement, and concurrency safeguards.",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    technologies: ["Node.js", "PostgreSQL", "Prisma", "Express"],
    links: {
      github: "https://github.com",
      demo: "https://demo.example.com",
    },
  },
  {
    title: "Reverse Hiring App",
    description:
      "Employer-focused recruitment platform where employers browse applicant profiles and send proposals directly.",
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    links: {
      github: "https://github.com",
      demo: "https://demo.example.com",
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

          <div className="grid gap-8 md:grid-cols-2">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={project.title}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:border-accent/50"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: project.image }}
                />

                <div className="relative p-6 md:p-8">
                  {/* Project Title and Description */}
                  <h3 className="mb-3 text-2xl font-bold text-foreground">
                    {project.title}
                  </h3>
                  <p className="mb-6 text-foreground/70 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.links.github && (
                      <motion.a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Github className="h-5 w-5" />
                        <span>Code</span>
                      </motion.a>
                    )}
                    {project.links.demo && (
                      <motion.a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span>Demo</span>
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Hover Border Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

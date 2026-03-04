"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SKILLS = [
  {
    category: "Frontend",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL", "GraphQL", "REST APIs", "JWT"],
  },
  {
    category: "Cloud & Tools",
    skills: ["AWS Amplify", "S3", "DynamoDB", "Git", "Prisma", "Postman"],
  },
  {
    category: "Concepts",
    skills: [
      "RBAC",
      "Optimistic Locking",
      "Concurrency Control",
      "Transaction Management",
      "Versioning Systems",
      "Audit Logging",
    ],
  },
];

export default function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-20 px-4 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">
              About Me
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Mid-level Software Engineer with a focus on enterprise systems,
              data integrity, and scalable full-stack architecture
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* About Text */}
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground/90">
                I&apos;m a mid-level Software Engineer specializing in
                enterprise HR systems and full-stack web applications. I focus
                on building robust, maintainable systems with strong data
                integrity, well-structured workflow architecture, and reliable
                performance.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                Currently engineering large-scale government HRIS platforms
                serving 17,000+ active users, covering multi-step hiring
                approval workflows, payroll calculation engines, and full
                contract lifecycle management — from draft through approval to
                archive.
              </p>
            </motion.div>

            {/* Skills Grid */}
            <motion.div variants={itemVariants} className="space-y-6">
              {SKILLS.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <h3 className="mb-3 font-semibold text-accent text-lg">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 text-sm font-medium text-foreground border border-primary/30 hover:border-accent/50 transition-all cursor-default"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid gap-8 sm:grid-cols-3"
          >
            {[
              { label: "Projects Completed", value: "6+" },
              { label: "Active Users Served", value: "17K+" },
              { label: "Years Experience", value: "2+" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="rounded-lg border border-border bg-card/50 p-6 text-center backdrop-blur-sm"
                whileHover={{ borderColor: "var(--color-accent)" }}
              >
                <div className="mb-2 text-4xl font-bold text-accent">
                  {stat.value}
                </div>
                <p className="text-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

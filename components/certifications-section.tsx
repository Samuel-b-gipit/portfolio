"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Award, ExternalLink } from "lucide-react";
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

interface Certification {
  name: string;
  issuer: string;
  date: string;
  verifyUrl?: string;
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

const CERTIFICATIONS: Certification[] = [
  {
    name: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2024",
    verifyUrl: "#",
  },
  {
    name: "Full-Stack Web Development",
    issuer: "Online Certification",
    date: "2023",
    verifyUrl: "#",
  },
  {
    name: "TypeScript Professional",
    issuer: "Certification Authority",
    date: "2024",
    verifyUrl: "#",
  },
];

export default function CertificationsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id="certifications"
      className="relative overflow-hidden py-24 px-6 md:py-32 md:px-8 lg:px-12"
      style={{ background: "var(--gradient-section-alt)" }}
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-20 dark:opacity-10" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          {/* Header */}
          <motion.div className="mb-16 text-center" variants={sectionHeader}>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Credentials
            </p>
            <h2 className="text-h2 text-balance mb-4">
              Education &amp; Certifications
            </h2>
            <p className="mx-auto max-w-2xl text-foreground/55 leading-relaxed">
              Academic foundation and professional certifications that
              complement hands-on engineering experience.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Education */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-h3">Education</h3>
              </div>

              <div className="space-y-4">
                {EDUCATION.map((edu) => (
                  <motion.div
                    key={edu.degree}
                    variants={cardVariants}
                    className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 transition-all hover:border-accent/30 hover:bg-card/60"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-foreground leading-snug">
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
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-accent/10 text-accent">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-h3">Certifications</h3>
              </div>

              <div className="space-y-4">
                {CERTIFICATIONS.map((cert) => (
                  <motion.div
                    key={cert.name}
                    variants={cardVariants}
                    className="group rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:bg-card/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                          {cert.name}
                          {cert.verifyUrl && (
                            <a
                              href={cert.verifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/30 hover:text-accent transition-colors"
                              aria-label={`Verify ${cert.name}`}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </h4>
                        <p className="text-sm text-foreground/50">
                          {cert.issuer}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-primary whitespace-nowrap px-2.5 py-1 rounded-full bg-primary/10">
                        {cert.date}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

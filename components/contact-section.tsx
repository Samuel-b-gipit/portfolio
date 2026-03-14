"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Linkedin, Github, Twitter, Send, CheckCircle2 } from "lucide-react";
import {
  staggerContainer,
  fadeInUp,
  sectionHeader,
  cardVariants,
} from "@/lib/animation-variants";

interface ContactSectionProps {
  clickCount?: number;
}

const SOCIALS = [
  {
    icon: Mail,
    label: "Email",
    value: "samuelgipit@gmail.com",
    href: "mailto:samuelgipit@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/samuelgipit",
    href: "https://www.linkedin.com/in/samuelgipit/",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/yourprofile",
    href: "https://github.com",
  },
  {
    icon: Twitter,
    label: "Twitter",
    value: "@yourhandle",
    href: "https://twitter.com",
  },
];

export default function ContactSection({
  clickCount = 0,
}: ContactSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setRateLimited(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          clickCount,
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        return;
      }

      if (!res.ok) throw new Error();

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-background py-24 px-6 md:py-32 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          {/* Header */}
          <motion.div className="mb-12 text-center" variants={sectionHeader}>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Contact
            </p>
            <h2 className="text-h2 text-balance mb-4">
              Get In Touch
            </h2>
            <p className="mx-auto max-w-2xl text-foreground/55 leading-relaxed">
              Have a project in mind? Let&apos;s collaborate and create something
              amazing together.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form — takes 3 cols */}
            <motion.div className="lg:col-span-3" variants={fadeInUp}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-border/40 bg-card/30 px-4 pt-5 pb-2 text-foreground backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-3.5 text-sm text-foreground/40 transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Name
                    </label>
                  </div>

                  {/* Email */}
                  <div className="floating-label-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-border/40 bg-card/30 px-4 pt-5 pb-2 text-foreground backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-3.5 text-sm text-foreground/40 transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Email
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div className="floating-label-group">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder=" "
                    className="peer w-full rounded-xl border border-border/40 bg-card/30 px-4 pt-5 pb-2 text-foreground backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-3.5 text-sm text-foreground/40 transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Message
                  </label>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={sending || submitted}
                  className="relative w-full overflow-hidden rounded-xl px-6 py-3.5 font-semibold text-primary-foreground transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: "var(--gradient-cta)" }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.span
                        key="sent"
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Message Sent!
                      </motion.span>
                    ) : sending ? (
                      <motion.span
                        key="sending"
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        Sending…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Send className="h-4 w-4" />
                        Send Message
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Status messages */}
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-500 dark:text-green-400 text-sm"
                    >
                      Thanks for reaching out! I&apos;ll get back to you soon.
                    </motion.div>
                  )}

                  {rateLimited && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-yellow-600 dark:text-yellow-400 text-sm"
                    >
                      You already sent a message recently. Please wait 5 minutes
                      before trying again.
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-500 dark:text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Social cards — takes 2 cols */}
            <motion.div
              className="lg:col-span-2 flex flex-col justify-center gap-3"
              variants={staggerContainer(0.08)}
            >
              <motion.div variants={fadeInUp} className="mb-4">
                <h3 className="text-lg font-bold text-foreground mb-1.5">
                  Let&apos;s Connect
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed">
                  Reach out through any of these channels — I&apos;d love to
                  hear from you.
                </p>
              </motion.div>

              {SOCIALS.map((contact) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={cardVariants}
                  className="group flex items-center gap-4 rounded-xl border border-border/30 bg-card/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-card/60"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                    <contact.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground/40">
                      {contact.label}
                    </p>
                    <p className="text-sm text-foreground truncate">
                      {contact.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Linkedin, Github, Twitter } from "lucide-react";

interface ContactSectionProps {
  clickCount?: number;
}

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

    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          clickCount: String(clickCount),
        },
        process.env.EMAILJS_PUBLIC_KEY!,
      );
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

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
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-20 px-4 md:py-32"
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
              Get In Touch
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Have a project in mind? Let's collaborate and create something
              amazing together
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending || submitted}
                  className="w-full rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/50 disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {sending
                    ? "Sending…"
                    : submitted
                      ? "Message Sent!"
                      : "Send Message"}
                </motion.button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg border border-accent/50 bg-accent/10 p-4 text-center text-accent"
                  >
                    Thanks for reaching out! I'll get back to you soon.
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center text-red-400"
                  >
                    {error}
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-center space-y-8"
            >
              <div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  Let's Connect
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  Whether you have a project in mind, want to collaborate, or
                  just want to say hello, I'd love to hear from you. Reach out
                  through any of these channels.
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                {[
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
                ].map((contact) => (
                  <motion.a
                    key={contact.label}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg border border-border bg-card/50 p-4 transition-all hover:border-accent/50 hover:bg-card/80"
                    whileHover={{ x: 10 }}
                  >
                    <contact.icon className="h-6 w-6 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground/70">
                        {contact.label}
                      </p>
                      <p className="text-foreground">{contact.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

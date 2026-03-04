"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

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
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">Samuel Gipit</span>
            <span className="sm:hidden">SG</span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <motion.div
              className="flex items-center gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-accent transition-colors font-medium"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className="rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-2 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/50"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.a>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-t border-border"
          initial={{ height: 0, opacity: 0 }}
          animate={
            isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="block text-foreground/80 hover:text-accent transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
                whileHover={{ x: 10 }}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              className="block rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-2 font-semibold text-primary-foreground text-center transition-all hover:shadow-lg hover:shadow-primary/50"
              onClick={() => setIsOpen(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}

"use client";

import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import SkillsSection from "@/components/skills-section";
import ProjectsSection from "@/components/projects-section";
import ExperienceSection from "@/components/experience-section";
import TestimonialsSection from "@/components/testimonials-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { ChatContainer } from "@/components/chat/chat-container";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden bg-background">
      <Navigation />
      <HeroSection />

      <div className="section-divider" />
      <SkillsSection />

      <div className="section-divider" />
      <ProjectsSection />

      <div className="section-divider" />
      <ExperienceSection />

      <div className="section-divider" />
      <TestimonialsSection />

      <div className="section-divider" />
      <AboutSection />

      <div className="section-divider" />
      <ContactSection />

      <Footer />
      <ChatContainer />
    </main>
  );
}

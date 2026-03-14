"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/projects-section";
import ExperienceSection from "@/components/experience-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <main className="w-full overflow-x-hidden bg-background">
      <Navigation />
      <HeroSection onProfileClick={() => setClickCount((c) => c + 1)} />
      <ProjectsSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection clickCount={clickCount} />
      <Footer />
    </main>
  );
}

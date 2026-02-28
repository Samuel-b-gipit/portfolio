import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import ProjectsSection from '@/components/projects-section'
import ExperienceSection from '@/components/experience-section'
import AboutSection from '@/components/about-section'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden bg-background">
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

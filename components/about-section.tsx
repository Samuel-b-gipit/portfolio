'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const SKILLS = [
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'PostgreSQL', 'MongoDB', 'Firebase', 'GraphQL', 'REST APIs'],
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code'],
  },
  {
    category: 'Other Skills',
    skills: ['Web Performance', 'SEO Optimization', 'Accessibility (A11y)', 'UI/UX Design', 'Problem Solving'],
  },
]

export default function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.1, once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section id="about" className="relative overflow-hidden bg-background py-20 px-4 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">About Me</h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Passionate developer with expertise in creating beautiful, functional web experiences
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* About Text */}
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground/90">
                I'm a creative developer with a passion for building exceptional digital experiences. 
                With 5+ years of experience in full-stack development, I specialize in creating responsive, 
                performant web applications that users love.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                My journey started with a curiosity about how websites work, and evolved into a deep 
                expertise in modern web technologies. I love combining technical excellence with thoughtful 
                design to create solutions that make a real impact.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source 
                projects, or creating interactive 3D experiences for the web.
              </p>
            </motion.div>

            {/* Skills Grid */}
            <motion.div variants={itemVariants} className="space-y-6">
              {SKILLS.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <h3 className="mb-3 font-semibold text-accent text-lg">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 text-sm font-medium text-foreground border border-primary/30 hover:border-accent/50 transition-all cursor-default"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
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
              { label: 'Projects Completed', value: '25+' },
              { label: 'Years Experience', value: '5+' },
              { label: 'Happy Clients', value: '50+' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="rounded-lg border border-border bg-card/50 p-6 text-center backdrop-blur-sm"
                whileHover={{ borderColor: 'var(--color-accent)' }}
              >
                <div className="mb-2 text-4xl font-bold text-accent">{stat.value}</div>
                <p className="text-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface Experience {
  title: string
  company: string
  period: string
  description: string
  highlights: string[]
}

const EXPERIENCES: Experience[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc',
    period: '2022 - Present',
    description: 'Leading development of scalable web applications and mentoring junior developers',
    highlights: [
      'Architected microservices infrastructure handling 1M+ daily requests',
      'Reduced load times by 60% through optimization and caching strategies',
      'Led team of 5 developers in agile environment',
    ],
  },
  {
    title: 'Full Stack Engineer',
    company: 'Digital Solutions Co',
    period: '2020 - 2022',
    description: 'Developed end-to-end web solutions for enterprise clients',
    highlights: [
      'Built 15+ client projects using React and Node.js',
      'Implemented real-time features using WebSockets',
      'Established development best practices and code standards',
    ],
  },
  {
    title: 'Junior Developer',
    company: 'StartUp Labs',
    period: '2019 - 2020',
    description: 'Started career building responsive web applications',
    highlights: [
      'Developed responsive UI components using React',
      'Collaborated with design team to implement mockups',
      'Learned and applied modern web development practices',
    ],
  },
]

export default function ExperienceSection() {
  const { ref, inView } = useInView({ threshold: 0.1, once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section id="experience" className="relative bg-gradient-to-b from-background to-primary/5 py-20 px-4 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">Experience</h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              A timeline of my professional journey and key achievements
            </p>
          </motion.div>

          <div className="relative space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent" />

            {EXPERIENCES.map((experience, idx) => (
              <motion.div
                key={experience.company}
                variants={itemVariants}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <motion.div
                  className="absolute left-0 top-2 h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                >
                  <div className="h-4 w-4 rounded-full bg-background" />
                </motion.div>

                {/* Content Card */}
                <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-card/80">
                  <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{experience.title}</h3>
                      <p className="text-lg text-primary font-medium">{experience.company}</p>
                    </div>
                    <span className="text-sm font-medium text-accent whitespace-nowrap">{experience.period}</span>
                  </div>

                  <p className="mb-4 text-foreground/70 leading-relaxed">{experience.description}</p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {experience.highlights.map((highlight, hidx) => (
                      <motion.li
                        key={hidx}
                        className="flex items-start gap-3 text-foreground/80"
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: idx * 0.2 + hidx * 0.1, duration: 0.5 }}
                      >
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                        <span>{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

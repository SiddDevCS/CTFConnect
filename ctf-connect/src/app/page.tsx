'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Users, Trophy } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Hero section */}
      <div className="relative">
        <div className="pt-20 pb-16 sm:pt-32 sm:pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Connect with CTF Enthusiasts
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Join a community of cybersecurity experts, participate in CTF competitions, and build your skills together.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/register"
                  className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                  <ArrowRight className="ml-2 inline-block h-4 w-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/about"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Feature section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
            >
              {[
                {
                  title: 'Find Your Team',
                  description: 'Connect with like-minded security enthusiasts and form the perfect CTF team.',
                  icon: Users,
                },
                {
                  title: 'Join Competitions',
                  description: 'Discover and participate in upcoming CTF events worldwide.',
                  icon: Trophy,
                },
                {
                  title: 'Build Skills',
                  description: 'Learn and grow together through collaborative challenges and projects.',
                  icon: Shield,
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="relative rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-x-4">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
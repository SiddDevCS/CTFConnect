'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Trophy, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 pt-32 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-32"
        >
          <h1 className="text-[3.5rem] font-bold mb-6 text-gray-900 leading-tight">
            Connect with CTF
            <br />
            Enthusiasts
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join a community of cybersecurity experts, participate in CTF competitions,
            and build your skills together.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/register"
              className="group relative inline-flex items-center px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:opacity-95 transition-all duration-200 shadow-[0_1px_12px_0_rgba(124,58,237,0.2)] hover:shadow-[0_1px_15px_0_rgba(124,58,237,0.3)]"
            >
              Get started
              <span className="ml-2 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Learn more →
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              icon: Users,
              title: "Find Your Team",
              description: "Connect with like-minded security enthusiasts and form the perfect CTF team."
            },
            {
              icon: Trophy,
              title: "Join Competitions",
              description: "Discover and participate in upcoming CTF events worldwide."
            },
            {
              icon: Shield,
              title: "Build Skills",
              description: "Learn and grow together through collaborative challenges and projects."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              className="group p-7 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 p-2.5 mb-5 group-hover:scale-105 transition-transform duration-200">
                <feature.icon className="w-full h-full text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
} 
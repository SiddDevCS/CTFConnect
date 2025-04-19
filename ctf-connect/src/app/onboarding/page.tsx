// src/app/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

interface OnboardingStep {
  id: number
  title: string
  description: string
  fields: OnboardingField[]
}

interface OnboardingField {
  name: string
  type: 'text' | 'select' | 'multiselect' | 'radio'
  label: string
  options?: string[]
  required?: boolean
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Let's get to know you",
    description: "Tell us about your experience and interests in cybersecurity",
    fields: [
      {
        name: 'skill_level',
        type: 'select',
        label: 'What is your current skill level in cybersecurity?',
        options: ['beginner', 'intermediate', 'advanced', 'expert'],
        required: true
      },
      {
        name: 'ctf_experience',
        type: 'select',
        label: 'How much experience do you have with CTFs?',
        options: ['none', 'beginner', 'intermediate', 'advanced', 'expert'],
        required: true
      }
    ]
  },
  {
    id: 2,
    title: 'Your Interests',
    description: 'Select the areas of cybersecurity that interest you the most',
    fields: [
      {
        name: 'interests',
        type: 'multiselect',
        label: 'Select your interests',
        options: [
          'Web Security',
          'Reverse Engineering',
          'Binary Exploitation',
          'Cryptography',
          'Forensics',
          'Network Security',
          'OSINT',
          'Mobile Security'
        ],
        required: true
      },
      {
        name: 'preferred_roles',
        type: 'multiselect',
        label: 'What roles are you interested in?',
        options: [
          'Team Leader',
          'Technical Lead',
          'Researcher',
          'Developer',
          'Analyst',
          'Documentation'
        ],
        required: true
      }
    ]
  },
  {
    id: 3,
    title: 'Team Preferences',
    description: 'Help us match you with the right team',
    fields: [
      {
        name: 'preferred_team_size',
        type: 'radio',
        label: 'What team size do you prefer?',
        options: ['small', 'medium', 'large'],
        required: true
      },
      {
        name: 'availability',
        type: 'select',
        label: 'What is your availability?',
        options: ['part_time', 'full_time', 'weekends_only', 'flexible'],
        required: true
      },
      {
        name: 'communication_style',
        type: 'select',
        label: 'What is your preferred communication style?',
        options: ['async', 'sync', 'mixed'],
        required: true
      }
    ]
  },
  {
    id: 4,
    title: 'Learning Goals',
    description: 'What do you want to achieve?',
    fields: [
      {
        name: 'learning_goals',
        type: 'multiselect',
        label: 'Select your learning goals',
        options: [
          'Improve technical skills',
          'Learn new security concepts',
          'Build a portfolio',
          'Network with others',
          'Prepare for certifications',
          'Win competitions',
          'Start a career in security'
        ],
        required: true
      },
      {
        name: 'time_zone',
        type: 'select',
        label: 'What is your time zone?',
        options: [
          'UTC-12:00',
          'UTC-11:00',
          'UTC-10:00',
          'UTC-09:00',
          'UTC-08:00',
          'UTC-07:00',
          'UTC-06:00',
          'UTC-05:00',
          'UTC-04:00',
          'UTC-03:00',
          'UTC-02:00',
          'UTC-01:00',
          'UTC+00:00',
          'UTC+01:00',
          'UTC+02:00',
          'UTC+03:00',
          'UTC+04:00',
          'UTC+05:00',
          'UTC+06:00',
          'UTC+07:00',
          'UTC+08:00',
          'UTC+09:00',
          'UTC+10:00',
          'UTC+11:00',
          'UTC+12:00'
        ],
        required: true
      }
    ]
  }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      }
    }

    checkOnboardingStatus()
  }, [])

  const handleInputChange = (field: OnboardingField, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.name]: value
    }))
  }

  const isStepComplete = (step: OnboardingStep) => {
    return step.fields.every(field => {
      if (!field.required) return true
      const value = formData[field.name]
      return value && (Array.isArray(value) ? value.length > 0 : true)
    })
  }

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
  setLoading(true)
  setError(null)

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    // Log the data being sent
    console.log('Submitting data:', formData)

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...formData,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })

    if (updateError) {
      console.error('Update error:', updateError)
      throw updateError
    }

    // Log success
    console.log('Profile updated successfully')

    // Force a router refresh and redirect
    router.push('/dashboard')
    router.refresh()
  } catch (error: any) {
    console.error('Submission error:', error)
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

  const currentStepData = onboardingSteps[currentStep]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress bar */}
        <div className="relative">
          <div className="absolute top-2 w-full h-0.5 bg-gray-200">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 mb-6">{currentStepData.description}</p>

            <div className="space-y-6">
              {currentStepData.fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === 'select' && (
                    <select
                      value={formData[field.name] || ''}
                      onChange={e => handleInputChange(field, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>
                          {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'multiselect' && (
                    <div className="grid grid-cols-2 gap-2">
                      {field.options?.map(option => (
                        <label
                          key={option}
                          className="inline-flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            checked={
                              (formData[field.name] || []).includes(option)
                            }
                            onChange={e => {
                              const currentValues = formData[field.name] || []
                              const newValues = e.target.checked
                                ? [...currentValues, option]
                                : currentValues.filter((v: string) => v !== option)
                              handleInputChange(field, newValues)
                            }}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'radio' && (
                    <div className="space-y-2">
                      {field.options?.map(option => (
                        <label
                          key={option}
                          className="inline-flex items-center mr-4"
                        >
                          <input
                            type="radio"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            name={field.name}
                            value={option}
                            checked={formData[field.name] === option}
                            onChange={e => handleInputChange(field, e.target.value)}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep === onboardingSteps.length - 1 ? (
                <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !isStepComplete(currentStepData)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    loading || !isStepComplete(currentStepData)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                >
                {loading ? 'Saving...' : 'Complete Setup'}
                <Check className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepComplete(currentStepData)}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    !isStepComplete(currentStepData)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { PasswordStrength } from '@/components/auth/password-rules'
import { INTEREST_TOPICS, MEMBER_CATEGORIES, PROVINCES } from '@/lib/members'
import { useRegisterStore } from '@/store/register-store'
import type { RegisterStep } from '@/store/types'
import { RegisterCheckbox, RegisterInput, RegisterSelect, TopicChip } from './register-fields'

function AccountStep() {
  const password = useRegisterStore((s) => s.formData.password)
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RegisterInput name="firstName" label="First name" autoComplete="given-name" maxLength={100} />
      <RegisterInput name="lastName" label="Last name" autoComplete="family-name" maxLength={100} />
      <RegisterInput name="email" label="Email address" type="email" placeholder="you@example.rw" autoComplete="email" maxLength={254} className="sm:col-span-2" />
      <RegisterInput name="phone" label="Phone number" type="tel" prefix="+250" placeholder="7XX XXX XXX" autoComplete="tel-national" maxLength={11} className="sm:col-span-2" />
      <RegisterInput name="password" label="Password" type="password" autoComplete="new-password" maxLength={72} />
      <RegisterInput name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" maxLength={72} />
      <div className="sm:col-span-2">
        <PasswordStrength password={password} />
      </div>
    </div>
  )
}

function ProfileStep() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RegisterSelect name="category" label="I am a" options={MEMBER_CATEGORIES} placeholder="Select a category" />
      <RegisterSelect name="province" label="Province" options={PROVINCES} placeholder="Select a province" />
      <RegisterInput name="institution" label="Institution or employer" placeholder="e.g. University of Rwanda" maxLength={150} className="sm:col-span-2" />
      <RegisterInput name="fieldOfStudy" label="Field of study or work (optional)" placeholder="e.g. Medical physics" maxLength={150} className="sm:col-span-2" />
    </div>
  )
}

function InterestsStep() {
  const error = useRegisterStore((s) => s.errors.interests)
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-rygn-navy">Topics you’re interested in</legend>
        <div className="flex flex-wrap gap-2">
          {INTEREST_TOPICS.map((topic) => (
            <TopicChip key={topic} topic={topic} />
          ))}
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </fieldset>

      <div className="space-y-3 border-t border-gray-200 pt-6">
        <RegisterCheckbox name="acceptTerms">
          I agree to the RYGN{' '}
          <Link href="/terms" className="font-semibold text-rygn-blue-dark hover:underline">
            membership terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-semibold text-rygn-blue-dark hover:underline">
            privacy policy
          </Link>
          .
        </RegisterCheckbox>
        <RegisterCheckbox name="newsletter">Send me news, events and opportunities by email.</RegisterCheckbox>
      </div>
    </div>
  )
}

/** Title, subtitle and form for each step. */
export const STEP_CONTENT: Record<RegisterStep, { title: string; subtitle: string; Form: () => React.JSX.Element }> = {
  1: { title: 'Create your account', subtitle: 'You’ll use these details to sign in.', Form: AccountStep },
  2: { title: 'Tell us about yourself', subtitle: 'This helps us connect you with the right programs and mentors.', Form: ProfileStep },
  3: { title: 'Choose your interests', subtitle: 'Pick the topics you’d like to hear about.', Form: InterestsStep },
}

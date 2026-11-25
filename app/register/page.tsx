'use client'

import { useEffect, type FormEvent } from 'react'
import { CircleCheck } from 'lucide-react'
import { RegisterSidebar } from '@/components/auth/register/register-sidebar'
import { STEP_CONTENT } from '@/components/auth/register/register-steps'
import { Button, ButtonLink } from '@/components/brand/button'
import { REGISTER_STEPS, useRegisterStore } from '@/store/register-store'

const REVIEW_NOTE = 'New accounts are reviewed by an administrator — you’ll get an email once approved.'

export default function RegisterPage() {
  const step = useRegisterStore((s) => s.step)
  const isSubmitted = useRegisterStore((s) => s.isSubmitted)
  const email = useRegisterStore((s) => s.formData.email)
  const next = useRegisterStore((s) => s.next)
  const back = useRegisterStore((s) => s.back)
  const reset = useRegisterStore((s) => s.reset)

  // Start fresh each visit.
  useEffect(() => reset, [reset])

  const total = REGISTER_STEPS.length
  const { title, subtitle, Form } = STEP_CONTENT[step]

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    next()
  }

  return (
    <div className="font-ui min-h-screen bg-rygn-surface text-rygn-navy">
      <RegisterSidebar step={isSubmitted ? total + 1 : step} />

      <main className="px-4 py-10 sm:px-8 lg:ml-[380px] lg:py-16">
        <div className="mx-auto max-w-2xl">
          {isSubmitted ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rygn-green/10">
                <CircleCheck className="h-8 w-8 text-rygn-green" />
              </span>
              <h2 className="font-heading text-3xl font-extrabold">Application received</h2>
              <p className="mt-3 text-gray-600">
                Thanks for joining RYGN. We’ve sent a confirmation to <span className="font-semibold text-rygn-navy">{email}</span>.
              </p>
              <p className="mt-2 text-gray-600">{REVIEW_NOTE}</p>
              <ButtonLink href="/" size="lg" className="mt-8">
                Back to the website
              </ButtonLink>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-rygn-blue-dark">
                Step {step} of {total}
              </p>
              <div
                className="mt-4 h-1.5 rounded-full bg-gray-200"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={total}
                aria-valuenow={step}
                aria-label="Registration progress"
              >
                <div className="h-full rounded-full bg-rygn-blue transition-all" style={{ width: `${(step / total) * 100}%` }} />
              </div>

              <form onSubmit={handleSubmit} noValidate className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
                <h2 className="font-heading text-3xl font-extrabold">{title}</h2>
                <p className="mb-8 mt-2 text-gray-600">{subtitle}</p>

                <Form />

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-gray-200 pt-6">
                  {step > 1 ? (
                    <Button variant="outline" size="lg" onClick={back}>
                      Back
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button type="submit" size="lg">
                    {step === total ? 'Create account' : 'Continue'}
                  </Button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">{REVIEW_NOTE}</p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

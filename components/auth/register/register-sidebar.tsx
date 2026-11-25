import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REGISTER_STEPS } from '@/store/register-store'

const LogoLink = () => (
  <Link href="/" className="inline-flex w-fit rounded-2xl bg-white px-5 py-4" aria-label="RYGN home">
    <img src="/images/logo.PNG" alt="RYGN - Rwandan Young Generation in Nuclear" className="h-12 w-auto object-contain" />
  </Link>
)

const SignInLink = () => (
  <p className="text-white/85">
    Already a member?{' '}
    <Link href="/login" className="font-semibold text-rygn-yellow underline underline-offset-2">
      Sign in
    </Link>
  </p>
)

/** Navy side panel with the step list (large screens) or a compact header (small screens). */
export function RegisterSidebar({ step }: { step: number }) {
  return (
    <aside className="bg-rygn-navy text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-[380px]">
      {/* Small screens */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:hidden">
        <LogoLink />
        <SignInLink />
      </div>

      {/* Large screens */}
      <div className="hidden h-full flex-col px-10 py-12 lg:flex">
        <LogoLink />
        <h1 className="font-heading mt-14 text-3xl font-extrabold">Join the network</h1>
        <p className="mt-4 leading-relaxed text-white/80">
          Membership is open to students and young professionals in nuclear science, engineering, medicine and policy.
        </p>

        <ol className="mt-10 space-y-2">
          {REGISTER_STEPS.map((s) => {
            const current = s.step === step
            const done = s.step < step
            return (
              <li
                key={s.step}
                aria-current={current ? 'step' : undefined}
                className={cn('flex items-center gap-4 rounded-xl px-4 py-3', current && 'bg-white/10')}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold',
                    current ? 'bg-rygn-yellow text-rygn-navy' : done ? 'bg-rygn-green' : 'bg-white/10',
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : s.step}
                </span>
                <span>
                  <span className="block font-semibold">{s.title}</span>
                  <span className="block text-sm text-white/70">{s.description}</span>
                </span>
              </li>
            )
          })}
        </ol>

        <div className="mt-auto">
          <SignInLink />
        </div>
      </div>
    </aside>
  )
}

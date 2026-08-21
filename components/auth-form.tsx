'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRight, Loader2, LockKeyhole, Mail, UserRound, Wallet } from 'lucide-react'

type Mode = 'login' | 'signup'

export default function AuthForm({ mode, uiOnly = false }: { mode: Mode; uiOnly?: boolean }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const isSignup = mode === 'signup'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    if (isSignup && name.length < 2) { setError('Please enter your name.'); setPending(false); return }
    if (password.length < 8) { setError('Use at least 8 characters for your password.'); setPending(false); return }

    if (uiOnly) {
      setSubmitted(true)
      setPending(false)
      return
    }

    if (isSignup) {
      const response = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
      if (!response.ok) { setError('We could not create that account. Try another email.'); setPending(false); return }
    }
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) { setError('That email and password do not match.'); setPending(false); return }
    router.push('/')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5 py-10 text-[#28252a]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e8e4df] bg-[#fbfaf8] shadow-[0_24px_80px_rgba(56,42,35,0.10)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col justify-between bg-[#27232a] p-10 text-[#fffaf5] lg:flex">
          <div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-[#fffaf5] text-[#27232a]"><Wallet className="size-[18px]" /></span><span className="text-[17px] font-bold tracking-[-0.04em]">Split<span className="text-[#f07d58]">Easy</span></span></div>
          <div><p className="max-w-[320px] text-4xl font-bold leading-tight tracking-[-0.06em]">Shared spending, without the awkward math.</p><p className="mt-5 max-w-[300px] text-sm leading-relaxed text-[#c7c0c3]">Keep every group expense clear, calm, and easy to settle.</p></div>
          <p className="text-xs text-[#9b9298]">Your money, made social.</p>
        </section>
        <section className="p-7 sm:p-12">
          <div className="mb-10 flex items-center gap-2 lg:hidden"><span className="flex size-9 items-center justify-center rounded-xl bg-[#27232a] text-[#fffaf5]"><Wallet className="size-[18px]" /></span><span className="text-[17px] font-bold tracking-[-0.04em]">Split<span className="text-[#f07d58]">Easy</span></span></div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">{isSignup ? 'Get started' : 'Welcome back'}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">{isSignup ? 'Create your account.' : 'Log in to SplitEasy.'}</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#88827d]">{isSignup ? 'Start splitting expenses with your people.' : 'Pick up where you left off with your groups.'}</p>
          {submitted && uiOnly && <p role="status" className="mt-8 rounded-xl bg-[#e4f0e8] px-3 py-2.5 text-sm text-[#356044]">This is a UI preview. Your account has not been created.</p>}
          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            {isSignup && <label className="flex flex-col gap-2 text-sm font-semibold">Your name<div className="flex items-center gap-3 rounded-xl border border-[#ded8d2] bg-white px-3 focus-within:ring-2 focus-within:ring-[#f07d58]"><UserRound className="size-4 text-[#aaa5a0]" /><input name="name" required className="h-11 min-w-0 flex-1 bg-transparent text-sm font-normal outline-none" placeholder="Rohan Kapoor" /></div></label>}
            <label className="flex flex-col gap-2 text-sm font-semibold">Email<div className="flex items-center gap-3 rounded-xl border border-[#ded8d2] bg-white px-3 focus-within:ring-2 focus-within:ring-[#f07d58]"><Mail className="size-4 text-[#aaa5a0]" /><input name="email" type="email" required className="h-11 min-w-0 flex-1 bg-transparent text-sm font-normal outline-none" placeholder="you@example.com" /></div></label>
            <label className="flex flex-col gap-2 text-sm font-semibold">Password<div className="flex items-center gap-3 rounded-xl border border-[#ded8d2] bg-white px-3 focus-within:ring-2 focus-within:ring-[#f07d58]"><LockKeyhole className="size-4 text-[#aaa5a0]" /><input name="password" type="password" required minLength={8} className="h-11 min-w-0 flex-1 bg-transparent text-sm font-normal outline-none" placeholder="At least 8 characters" /></div></label>
            {error && <p role="alert" className="rounded-xl bg-[#fbe2d8] px-3 py-2.5 text-sm text-[#a64f35]">{error}</p>}
            <button disabled={pending} className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#27232a] text-sm font-semibold text-white transition hover:bg-[#3d3740] disabled:cursor-wait disabled:opacity-70">{pending ? <Loader2 className="size-4 animate-spin" /> : <>{isSignup ? 'Create account' : 'Log in'}<ArrowRight className="size-4" /></>}</button>
          </form>
          <p className="mt-7 text-center text-sm text-[#88827d]">{isSignup ? 'Already have an account?' : 'New to SplitEasy?'} <Link className="font-semibold text-[#d96f4d] hover:underline" href={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link></p>
        </section>
      </div>
    </main>
  )
}

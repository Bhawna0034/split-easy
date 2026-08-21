'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Loader2, Wallet } from 'lucide-react'

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ callbackUrl: '/login' })
  }, [])

  return <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5 text-[#28252a]"><div className="flex flex-col items-center gap-5 text-center"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#27232a] text-[#fffaf5]"><Wallet className="size-5" /></span><h1 className="text-2xl font-bold tracking-[-0.04em]">Signing you out</h1><p className="text-sm text-[#88827d]">Clearing your session securely.</p><Loader2 className="size-5 animate-spin text-[#f07d58]" aria-label="Loading" /></div></main>
}

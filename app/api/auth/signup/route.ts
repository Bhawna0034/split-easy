import { NextResponse } from 'next/server'
import { createUser } from '@/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const password = String(body.password ?? '')
    if (name.length < 2 || !email.includes('@') || password.length < 8) return NextResponse.json({ error: 'Invalid details' }, { status: 400 })
    await createUser(name, email, password)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unable to create account' }, { status: 400 })
  }
}

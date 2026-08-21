import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.password || !(await bcrypt.compare(password, user.password))) return null
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  pages: { signIn: '/login' },
})

export const { GET, POST } = handlers

export async function createUser(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) throw new Error('Unable to create account')
  const hashedPassword = await bcrypt.hash(password, 12)
  return prisma.user.create({ data: { name: name.trim(), email: normalizedEmail, password: hashedPassword } })
}

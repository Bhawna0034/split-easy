import type { Metadata } from 'next'
import AuthForm from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Create your SplitEasy account',
  description: 'Create an account to split shared expenses with your people.',
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}

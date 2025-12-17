'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function loginUser(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Login gagal' }
  }

  // Redirect to dashboard after successful login
  redirect('/dashboard')
}

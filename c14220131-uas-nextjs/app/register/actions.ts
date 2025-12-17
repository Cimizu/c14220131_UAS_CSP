'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validasi password
  if (password !== confirmPassword) {
    return { error: 'Password tidak cocok' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' }
  }

  const supabase = createClient()

  // Registrasi user di Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Gagal membuat user' }
  }

  // Jika berhasil, redirect ke login
  redirect('/login')
}

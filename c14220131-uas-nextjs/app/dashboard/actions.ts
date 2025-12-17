'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function logoutUser() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
  
  redirect('/login')
}

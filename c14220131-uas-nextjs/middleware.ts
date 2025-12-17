import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Create a response to attach headers
  const response = NextResponse.next()
  
  try {
    const supabase = createClient()
    
    // Get user session
    const { data: { user } } = await supabase.auth.getUser()
    
    // Redirect unauthenticated users to login
    if (!user && pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Redirect authenticated users away from login/register
    if (user && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    console.error('Middleware error:', error)
  }
  
  return response
}

export const config = {
  matcher: ['/dashboard', '/login', '/register'],
}

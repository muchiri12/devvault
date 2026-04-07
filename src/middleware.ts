import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/env'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Initialize Supabase Client
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. Refresh the session 
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Route Guarding
  const url = request.nextUrl
  const path = url.pathname

  // Redirect Logged-In users away from Login/Register
  if (user && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect /dashboard from logged-out users
  if (!user && (path.startsWith('/dashboard') || path === '/onboarding')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ONBOARDING TRAP & ADMIN PROTECTION
  if (user && (path.startsWith('/dashboard') || path === '/onboarding')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, role')
      .eq('id', user.id)
      .single()

    const hasUsername = !!profile?.username;

    // Trap incomplete users inside the Onboarding screen
    if (!hasUsername && path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Prevent fully onboarded users from going back to the Onboarding screen
    if (hasUsername && path === '/onboarding') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Admin Protection
    if (path.startsWith('/dashboard/admin') && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

// 4. PERFORMANCE MATCHER: Ensures it only runs on actual pages
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (static assets like your logo)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

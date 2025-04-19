// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create response
  const res = NextResponse.next()
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Define routes
  const publicRoutes = ['/', '/home', '/events']
  const authRoutes = ['/login', '/register', '/auth/callback']
  const protectedRoutes = ['/dashboard', '/projects', '/teams', '/profile']

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname === `${route}/`
  )
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  try {
    // Get user - this verifies the JWT with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser()

    // Handle root path
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/home', request.url))
    }

    // Allow access to public routes
    if (isPublicRoute) {
      return res
    }

    // Handle auth routes
    if (isAuthRoute) {
      // If user is already logged in and trying to access auth routes, redirect to dashboard
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return res
    }

    // Handle protected routes
    if (isProtectedRoute) {
      // If no user or error, redirect to login
      if (!user || error) {
        // Store the attempted URL to redirect back after login
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // If user exists but hasn't completed onboarding
      if (user && request.nextUrl.pathname !== '/onboarding') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        if (!profile?.onboarding_completed) {
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }
      }
    }

    return res
  } catch (error) {
    // If there's any error, redirect to login for protected routes
    if (isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
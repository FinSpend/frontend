import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/transactions',
  '/budgeting',
  '/ai-suggestions',
  '/reports',
  '/onboarding',
  '/profile',
  '/settings',
]

// Routes that redirect authenticated users away (already logged in)
const authOnlyRoutes = ['/login', '/register', '/forgot-password']

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthOnly = authOnlyRoutes.some((route) => pathname.startsWith(route))

  // Not authenticated and trying to access a protected route
  if (!token && isProtected) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already authenticated and trying to access auth pages
  if (token && isAuthOnly) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|svg|ico|webp|json|txt)).*)'],
}

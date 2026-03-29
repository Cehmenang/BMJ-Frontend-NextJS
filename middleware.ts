import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  const authRoutes = ['/login', '/register']
  const protectedPaths = ['/dashboard', '/admin', '/profile', '/settings']

  // 1. Jika user SUDAH LOGIN dan mencoba akses halaman login/register
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    // Gunakan redirect ke dashboard agar lebih pasti tujuannya
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. Jika user BELUM LOGIN dan mencoba akses halaman terproteksi
  if (!token && protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Penting: Biarkan request berlanjut jika tidak memenuhi kondisi di atas
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
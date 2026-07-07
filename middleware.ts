import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value // <── Tetap pakai access_token punya lu
  const isAdmin = request.cookies.get('role')?.value == "ADMIN" ? true : false
  const { pathname } = request.nextUrl

  const authRoutes = ['/login', '/register']
  const protectedPaths = ['/dashboard', '/profile', '/settings', '/upload']
  const adminPaths = ['/dashboard', '/upload']

  // 1. Jika user SUDAH LOGIN dan mencoba akses halaman login/register
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. Jika bukan ADMIN dan mencoba akses halaman terproteksi
  if ((token && isAdmin == false) && adminPaths.some(path => pathname.startsWith(`${path}/X`))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. Jika belum login dan mencoba akses protected routes
  if(!token && protectedPaths.some(path => pathname.startsWith(path))){
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ──────────────────────────────────────────────────────────────
  // 🎯 LOGIKA GUEST ID DIJAIT DI SINI (SEBELUM NEXT RESPONSE)
  // ──────────────────────────────────────────────────────────────
  
  // Ubah return default-nya jadi variabel response dulu
  const response = NextResponse.next()
  
  // Cek cookie guest_id yang sudah ada di browser
  const guestId = request.cookies.get('guest_id')?.value

  // Kondisi: Jika BELUM LOGIN (!token) dan BELUM PUNYA GUEST ID (!guestId)
  if (!token && !guestId) {
    const newGuestId = crypto.randomUUID() // Generate UUID baru
    
    // Tanam cookie guest_id ke dalam response
    response.cookies.set('guest_id', newGuestId, {
      maxAge: 60 * 60 * 24 * 30, // Berlaku 30 hari
      path: '/',
      httpOnly: false, // Set false agar bisa dibaca dari client component/javascript biasa
      secure: process.env.NODE_ENV === 'production',
    })
  }

  // Kembalikan response yang sudah dimodifikasi
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
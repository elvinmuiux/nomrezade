import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log(`🔍 Middleware triggered for: ${request.nextUrl.pathname}`)
  
  const { pathname } = request.nextUrl
  
  // Handle secret admin access path
  if (pathname === '/0x/admin') {
    console.log(`🔑 Secret admin access detected - rewriting to /admin`)
    return NextResponse.rewrite(new URL('/admin', request.url))
  }
  
  // Allow all API requests
  if (pathname.startsWith('/api/')) {
    console.log(`✅ Allowing API request to: ${pathname}`)
    return NextResponse.next()
  }
  
  // Check if this is a blocked path for pages
  const isBlockedPath = 
    pathname === '/login' || 
    pathname === '/register'
  
  if (isBlockedPath) {
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer')
    const acceptHeader = request.headers.get('accept') || ''
    const secFetchMode = request.headers.get('sec-fetch-mode')
    const secFetchDest = request.headers.get('sec-fetch-dest')
    
    // Check if this is a browser navigation (not API/fetch request)
    const isBrowserNavigation = 
      acceptHeader.includes('text/html') &&
      (secFetchMode === 'navigate' || secFetchMode === null) &&
      (secFetchDest === 'document' || secFetchDest === null)
    
    console.log(`🚫 Blocked path detected: ${pathname}`)
    console.log(`📱 User-Agent: ${userAgent.substring(0, 50)}...`)
    console.log(`🔗 Referer: ${referer || 'none'}`)
    console.log(`🌐 Accept: ${acceptHeader}`)
    console.log(`� Sec-Fetch-Mode: ${secFetchMode || 'none'}`)
    console.log(`🎯 Sec-Fetch-Dest: ${secFetchDest || 'none'}`)
    console.log(`�🔄 Is Browser Navigation: ${isBrowserNavigation}`)
    
    // For /login, /register and /admin pages
    if (isBrowserNavigation && !referer) {
      console.log(`🚫 Blocking direct browser access to: ${pathname} - redirecting to /`)
      return NextResponse.redirect(new URL('/', request.url))
    } else if (referer?.includes('localhost')) {
      console.log(`✅ Allowing internal navigation to: ${pathname}`)
      return NextResponse.next()
    } else {
      console.log(`🚫 Blocking external access to: ${pathname}`)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  console.log(`✅ Allowing request to: ${pathname}`)
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
    '/login',
    '/register',
    '/admin',
    '/0x/admin'
  ]
};
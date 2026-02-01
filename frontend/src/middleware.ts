import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    })

    const isLoggedIn = !!token

    if (pathname === '/login') {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        return NextResponse.next()
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Role-based protection for /user-management
    if (pathname.startsWith('/user-management') && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/customers/:path*',
        '/notifications/:path*',
        '/call-register/:path*',
        '/user-management/:path*',
        '/login',
    ]
}

import { createAuthClient } from 'better-auth/client'
import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

const authClient = createAuthClient()

export async function middleware(request: NextRequest) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/library', '/projects', '/projects/:path*'],
}

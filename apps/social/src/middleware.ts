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
    const url = request.nextUrl
    url.searchParams.append('retpath', url.pathname)
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/library', '/projects', '/projects/:path*'],
}

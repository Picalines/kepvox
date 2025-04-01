import 'server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { headers } from 'next/headers'
import { RedirectType, redirect } from 'next/navigation'
import { database, tables } from '#shared/database'
import { ENV } from '#shared/env'

export const authServer = betterAuth({
  database: drizzleAdapter(database, {
    provider: 'pg',
    schema: tables,
  }),
  plugins: [nextCookies()],
  socialProviders: {
    github: {
      clientId: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
    },
  },
})

type AuthenticateOrRedirectParams = {
  headers?: ReadonlyHeaders
  fallbackUrl?: string
}

export const authenticateOrRedirect = async (params?: AuthenticateOrRedirectParams) => {
  const { headers: headersParam, fallbackUrl = '/sign-in' } = params ?? {}

  const session = await authServer.api.getSession({
    headers: headersParam ?? (await headers()),
  })

  if (!session) {
    redirect(fallbackUrl, RedirectType.replace)
  }

  return session
}

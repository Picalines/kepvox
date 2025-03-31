import 'server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
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

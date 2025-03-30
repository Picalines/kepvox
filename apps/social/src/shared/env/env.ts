import { loadEnvConfig } from '@next/env'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  IS_BUILD: z.enum(['true', 'false']).optional(),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
})

loadEnvConfig(process.cwd(), process.env.NODE_ENV === 'development')

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  throw new Error('invalid environment variables. See the `.env.development` for example')
}

export const ENV = parsedEnv.data

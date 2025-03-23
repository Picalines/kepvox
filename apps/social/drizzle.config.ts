import { defineConfig } from 'drizzle-kit'
import { ENV } from '#shared/env'

export default defineConfig({
  schema: './src/shared/database/schema.ts',
  out: './src/shared/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL,
    ssl: ENV.NODE_ENV === 'production',
  },
})

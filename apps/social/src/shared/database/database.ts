import { drizzle } from 'drizzle-orm/node-postgres'
import { Client as PostgresClient } from 'pg'
import { ENV } from '#shared/env'

const pgClient = new PostgresClient({ connectionString: ENV.DATABASE_URL })

if (ENV.IS_BUILD !== 'true') {
  await pgClient.connect()
}

export const database = drizzle(pgClient)

import { drizzle } from 'drizzle-orm/node-postgres'
import { Client as PostgresClient } from 'pg'
import { ENV } from '#shared/env'

declare global {
  /**
   * @internal do not use outside database.ts
   */
  var __postgresClient: PostgresClient | undefined
}

if (!global.__postgresClient) {
  global.__postgresClient = new PostgresClient({ connectionString: ENV.DATABASE_URL })

  if (ENV.IS_BUILD !== 'true') {
    await global.__postgresClient.connect()
  }
}

export const database = drizzle(global.__postgresClient)

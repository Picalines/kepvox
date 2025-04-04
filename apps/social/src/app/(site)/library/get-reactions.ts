'use server'

import { and, eq } from 'drizzle-orm'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'

export const getReactions = async () => {
  const { user } = await authenticateOrRedirect()

  const reactions = await database.transaction(
    async tx => {
      const query = (isPositive: boolean) =>
        tx
          .select({
            publication: {
              id: tables.publication.id,
              name: tables.publication.name,
            },
          })
          .from(tables.publication)
          .innerJoin(
            tables.reaction,
            and(
              eq(tables.reaction.listenerId, user.id),
              eq(tables.reaction.publicationId, tables.publication.id),
              eq(tables.reaction.isPositive, isPositive),
            ),
          )

      return { positive: await query(true), negative: await query(false) }
    },
    { accessMode: 'read only' },
  )

  return { reactions }
}

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
            id: tables.publication.id,
            name: tables.publication.name,
            description: tables.publication.description,
            author: {
              name: tables.user.name,
              avatar: tables.user.image,
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
          .innerJoin(tables.project, eq(tables.publication.projectId, tables.project.id))
          .innerJoin(tables.user, eq(tables.project.authorId, tables.user.id))

      return { positive: await query(true), negative: await query(false) }
    },
    { accessMode: 'read only' },
  )

  return { reactions }
}

'use server'

import { isTuple } from '@repo/common/predicate'
import { and, eq, isNotNull, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { authenticateOrNull } from '#shared/auth-server'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  author: z.object({
    id: z.string().min(1),
  }),
})

export const getAuthor = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const {
    author: { id: authorId },
  } = input

  const session = await authenticateOrNull()

  const { error, author, publications } = await database.transaction(
    async tx => {
      const selectedUsers = await tx
        .select({
          name: tables.user.name,
          avatar: tables.user.image,
          subscribed: isNotNull(tables.subscription.authorId),
        })
        .from(tables.user)
        .leftJoin(
          tables.subscription,
          session
            ? and(eq(tables.subscription.listenerId, session.user.id), eq(tables.subscription.authorId, authorId))
            : sql`false`,
        )
        .where(eq(tables.user.id, authorId))

      if (!isTuple(selectedUsers, 1)) {
        return { error: 'not-found' } as const
      }

      const [author] = selectedUsers

      const publications = await tx
        .select({
          id: tables.publication.id,
          name: tables.publication.name,
          description: tables.publication.description,
          createdAt: tables.publication.createdAt,
        })
        .from(tables.publication)
        .innerJoin(tables.project, eq(tables.project.id, tables.publication.projectId))
        .where(eq(tables.project.authorId, authorId))

      return {
        author: { ...author, isMe: session?.user.id === authorId },
        publications,
      }
    },
    { accessMode: 'read only' },
  )

  if (error === 'not-found') {
    notFound()
  }

  return { author, publications }
}

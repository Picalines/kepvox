'use server'

import { isTuple } from '@repo/common/array'
import { and, eq, isNotNull, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { authenticateOrNull } from '#shared/auth-server'
import { database, tables } from '#shared/database'
import { migrateProject } from '#shared/schema'

const inputSchema = z.object({
  publication: z.object({
    id: z.string(),
  }),
})

export const getPublication = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const {
    publication: { id: publicationId },
  } = input

  const session = await authenticateOrNull()

  const selectedPublication = await database
    .select({
      publication: { name: tables.publication.name, description: tables.publication.description },
      project: { content: tables.project.content },
      author: { id: tables.user.id, name: tables.user.name },
      reaction: { isPositive: tables.reaction.isPositive },
      listened: isNotNull(tables.listen.publicationId),
    })
    .from(tables.publication)
    .innerJoin(tables.project, eq(tables.publication.projectId, tables.project.id))
    .innerJoin(tables.user, eq(tables.project.authorId, tables.user.id))
    .leftJoin(
      tables.reaction,
      session
        ? and(eq(tables.publication.id, tables.reaction.publicationId), eq(tables.reaction.listenerId, session.user.id))
        : sql`false`,
    )
    .leftJoin(
      tables.listen,
      session
        ? and(eq(tables.publication.id, tables.listen.publicationId), eq(tables.listen.listenerId, session.user.id))
        : sql`false`,
    )
    .where(eq(tables.publication.id, publicationId))

  if (!isTuple(selectedPublication, 1)) {
    notFound()
  }

  const [
    {
      publication,
      project: { content: oldProjectContent },
      author,
      reaction,
      listened,
    },
  ] = selectedPublication

  const project = migrateProject(oldProjectContent)

  if (!project) {
    throw new Error('project migration failed')
  }

  return { publication, project, author, reaction, listened }
}

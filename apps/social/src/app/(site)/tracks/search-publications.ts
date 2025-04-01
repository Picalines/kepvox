'use server'

import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  namePart: z.string(),
})

export const searchPublications = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const { namePart } = input

  const publications = await database
    .select({
      id: tables.publication.id,
      name: tables.publication.name,
      description: tables.publication.description,
      author: { id: tables.project.authorId, name: tables.user.name },
    })
    .from(tables.publication)
    .innerJoin(tables.project, eq(tables.publication.projectId, tables.project.id))
    .innerJoin(tables.user, eq(tables.project.authorId, tables.user.id))
    .where(sql`${tables.publication.name} ILIKE '%' || ${namePart} || '%'`)

  return { publications }
}

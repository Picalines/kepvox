'use server'

import { count, eq, gt, sql } from 'drizzle-orm'
import { z } from 'zod'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  namePart: z.string(),
})

export const searchAuthors = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const { namePart } = input

  const authors = await database
    .select({ id: tables.user.id, name: tables.user.name })
    .from(tables.user)
    .innerJoin(tables.project, eq(tables.project.authorId, tables.user.id))
    .innerJoin(tables.publication, eq(tables.project.id, tables.publication.projectId))
    .groupBy(tables.user.id)
    .having(gt(count(tables.publication), 0))
    .where(sql`${tables.user.name} ILIKE '%' || ${namePart} || '%'`)

  return { authors }
}

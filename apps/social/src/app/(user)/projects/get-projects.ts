'use server'

import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  authorId: z.string().min(1),
})

export const getProjects = async (input: z.infer<typeof inputSchema>) => {
  const { authorId } = inputSchema.parse(input)

  return await database
    .select({
      id: tables.project.id,
      name: tables.project.name,
      description: tables.project.description,
      updatedAt: tables.project.updatedAt,
    })
    .from(tables.project)
    .where(eq(tables.project.authorId, authorId))
    .orderBy(desc(tables.project.updatedAt))
}

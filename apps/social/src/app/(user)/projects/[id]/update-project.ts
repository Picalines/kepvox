'use server'

import { isTuple } from '@repo/common/array'
import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'
import { projectSchema } from '#shared/schema'

const inputSchema = z.object({
  project: z.object({
    id: z.string().min(1),
    content: projectSchema,
  }),
})

export const updateProject = async (input: z.infer<typeof inputSchema>) => {
  if (!inputSchema.safeParse(input).success) {
    throw new Error('invalid project content')
  }

  const {
    project: { id: projectId, content },
  } = input

  const { user } = await authenticateOrRedirect()

  const updatedProjects = await database
    .update(tables.project)
    .set({ content, updatedAt: new Date() })
    .where(and(eq(tables.project.authorId, user.id), eq(tables.project.id, projectId)))
    .returning({ id: tables.project.id })

  if (!isTuple(updatedProjects, 1) || updatedProjects[0].id !== projectId) {
    notFound()
  }
}

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
  }),
})

export const getProject = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const {
    project: { id: projectId },
  } = input

  const { user } = await authenticateOrRedirect()

  const selectedProjects = await database
    .select({
      name: tables.project.name,
      description: tables.project.description,
      content: tables.project.content,
    })
    .from(tables.project)
    .where(and(eq(tables.project.id, projectId), eq(tables.project.authorId, user.id)))

  if (!isTuple(selectedProjects, 1)) {
    notFound()
  }

  const [{ content: rawProjectContent, ...project }] = selectedProjects

  const { success, data: content } = projectSchema.safeParse(rawProjectContent)

  if (!success) {
    throw new Error('project migration failed')
  }

  return {
    project: { ...project, content },
  }
}

import { isTuple } from '@repo/common/array'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { RedirectType, notFound, redirect } from 'next/navigation'
import { z } from 'zod'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  project: z.object({ id: z.string().min(1) }),
})

export const publishProject = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const {
    project: { id: projectId },
  } = input

  const { user } = await authenticateOrRedirect()

  const { publicationId, error } = await database.transaction(async tx => {
    const selectedProjects = await tx
      .select({
        id: tables.project.id,
        name: tables.project.name,
        description: tables.project.description,
      })
      .from(tables.project)
      .where(and(eq(tables.project.authorId, user.id), eq(tables.project.id, projectId)))

    if (!isTuple(selectedProjects, 1)) {
      return { error: 'project-not-found' } as const
    }

    const existingPublications = await tx
      .select({ id: tables.publication.id })
      .from(tables.publication)
      .where(eq(tables.publication.projectId, projectId))

    if (isTuple(existingPublications, 1)) {
      const [{ id: publicationId }] = existingPublications
      return { error: 'already-published', publicationId } as const
    }

    const [project] = selectedProjects

    const insertedPublications = await tx
      .insert(tables.publication)
      .values({
        projectId: project.id,
        name: project.name,
        description: project.description,
      })
      .returning({ id: tables.publication.id })

    if (!isTuple(insertedPublications, 1)) {
      return { error: 'publication-not-created' } as const
    }

    const [{ id: publicationId }] = insertedPublications

    return { publicationId } as const
  })

  if (error === 'project-not-found') {
    notFound()
  }

  if (error === 'publication-not-created') {
    throw new Error('publication not created')
  }

  // OK on already-published

  revalidatePath(`/authors/${user.id}`)
  redirect(`/tracks/${publicationId}`, RedirectType.push)
}

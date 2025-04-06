'use server'

import { isNonEmpty } from '@repo/common/array'
import { revalidatePath } from 'next/cache'
import { RedirectType, redirect } from 'next/navigation'
import type { z } from 'zod'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'
import type { projectSchema } from '#shared/schema'

export const createProject = async () => {
  const { user } = await authenticateOrRedirect()

  const inserted = await database
    .insert(tables.project)
    .values({
      name: 'untitled',
      description: '',
      authorId: user.id,
      content: INITIAL_PROJECT_CONTENT,
    })
    .onConflictDoNothing()
    .returning({ id: tables.project.id })

  if (!isNonEmpty(inserted)) {
    throw new Error('Failed to create a project')
  }

  revalidatePath('/projects')

  redirect(`/projects/${inserted[0].id}`, RedirectType.push)
}

const INITIAL_PROJECT_CONTENT: z.infer<typeof projectSchema> = {
  synthTree: {
    nodes: {
      output: {
        type: 'output',
        position: { x: 0, y: 0 },
        params: {},
      },
      generator: {
        type: 'generator',
        position: { x: -200, y: 0 },
        params: {},
      },
    },
    edges: {
      'generator-output': {
        source: { node: 'generator', socket: 0 },
        target: { node: 'output', socket: 0 },
      },
    },
  },
}

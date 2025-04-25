'use server'

import { isTuple } from '@repo/common/predicate'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  author: z.object({
    id: z.string().min(1),
  }),
})

export const subscribeToAuthor = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const {
    author: { id: authorId },
  } = input

  const { user } = await authenticateOrRedirect()

  if (user.id === authorId) {
    return
  }

  const { error } = await database.transaction(
    async tx => {
      const selectedUsers = await tx
        .select({ id: tables.user.id })
        .from(tables.user)
        .where(eq(tables.user.id, authorId))

      if (!isTuple(selectedUsers, 1)) {
        return { error: 'not-found' } as const
      }

      await tx.insert(tables.subscription).values({ listenerId: user.id, authorId }).onConflictDoNothing()

      return {}
    },
    { accessMode: 'read write' },
  )

  if (error === 'not-found') {
    notFound()
  }

  revalidatePath(`/authors/${authorId}`)
  revalidatePath('/library')
}

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  publication: z.object({
    id: z.string().min(1),
  }),
  reaction: z.object({
    isPositive: z.boolean(),
  }),
})

export const reactToPublication = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const {
    publication: { id: publicationId },
    reaction: { isPositive },
  } = input

  const { user } = await authenticateOrRedirect()

  await database
    .insert(tables.reaction)
    .values({ listenerId: user.id, publicationId, isPositive })
    .onConflictDoUpdate({
      target: [tables.reaction.listenerId, tables.reaction.publicationId],
      set: { isPositive },
    })

  revalidatePath(`/tracks/${publicationId}`)
  revalidatePath('/library')
}

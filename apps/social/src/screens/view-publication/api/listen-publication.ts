'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authenticateOrNull } from '#shared/auth-server'
import { database, tables } from '#shared/database'

const inputSchema = z.object({
  publication: z.object({
    id: z.string(),
  }),
})

export const listenPublication = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const {
    publication: { id: publicationId },
  } = input

  const session = await authenticateOrNull()

  if (!session) {
    return
  }

  const { user } = session

  await database.insert(tables.listen).values({ publicationId, listenerId: user.id }).onConflictDoNothing()

  revalidatePath(`/tracks/${publicationId}`)
}

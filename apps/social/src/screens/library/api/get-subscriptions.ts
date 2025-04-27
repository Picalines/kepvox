'use server'

import { and, desc, eq } from 'drizzle-orm'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'

export const getSubscriptions = async () => {
  const { user } = await authenticateOrRedirect()

  const subscriptions = await database
    .select({
      id: tables.user.id,
      name: tables.user.name,
      avatar: tables.user.image,
    })
    .from(tables.user)
    .innerJoin(
      tables.subscription,
      and(eq(tables.subscription.listenerId, user.id), eq(tables.subscription.authorId, tables.user.id)),
    )
    .orderBy(desc(tables.subscription.createdAt))

  return { subscriptions }
}

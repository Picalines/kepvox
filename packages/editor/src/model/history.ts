import { createFactory } from '@withease/factories'
import { createEvent, createStore } from 'effector'
import { readonly } from 'patronum'
import type { ActionPayload } from './action'

export type HistoryStore = ReturnType<typeof createHistory>

export const createHistory = createFactory(() => {
  const $actions = createStore<ActionPayload[]>([])

  const dispatched = createEvent<ActionPayload>()

  // TODO: track action history here

  return {
    $actions: readonly($actions),
    dispatched: dispatched,
  }
})

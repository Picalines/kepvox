import { createFactory } from '@withease/factories'
import { createEffect, createEvent, createStore, sample, scopeBind } from 'effector'
import { readonly } from 'patronum'
import { type ActionPayload, TRACKED_EDITOR_ACTIONS } from './action'
import type { EditorGate } from './gate'

export type HistoryStore = ReturnType<typeof createHistory>

type Params = {
  gate: EditorGate
}

export const createHistory = createFactory((params: Params) => {
  const { gate } = params

  const $actions = createStore<ActionPayload[]>([])

  const userRequestedActions = createEvent<ActionPayload[]>()
  const dispatched = createEvent<ActionPayload>()

  const dispatchFx = createEffect(({ isReadonly, actions }: { isReadonly: boolean; actions: ActionPayload[] }) => {
    const dispatch = scopeBind(dispatched)

    for (const action of actions) {
      if (isReadonly && TRACKED_EDITOR_ACTIONS.includes(action.action)) {
        continue
      }

      dispatch(action)
    }
  })

  // TODO: track action history here

  sample({
    clock: userRequestedActions,
    source: gate.$isReadonly,
    target: dispatchFx,
    fn: (isReadonly, actions) => ({ isReadonly, actions }),
  })

  return {
    $actions: readonly($actions),
    dispatched,
    userRequestedActions,
  }
})

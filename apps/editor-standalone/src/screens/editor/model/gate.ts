import { createFactory } from '@withease/factories'
import { sample } from 'effector'
import { createGate } from 'effector-react'
import { not, readonly } from 'patronum'

export type EditorGate = ReturnType<typeof createEditorGate>

export const createEditorGate = createFactory(() => {
  const Gate = createGate<{}>()

  const $isOpened = Gate.status

  const opened = sample({ clock: $isOpened, filter: $isOpened })
  const closed = sample({ clock: $isOpened, filter: not($isOpened) })

  return {
    $isOpened: readonly($isOpened),
    Gate,
    closed,
    opened,
  }
})

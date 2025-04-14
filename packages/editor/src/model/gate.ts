import { createFactory } from '@withease/factories'
import { type Store, combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { not, readonly } from 'patronum'
import type { Project } from './project'

type EditorProps = {
  readonly: boolean
  initialProject: Project
  externalLoading: boolean
  serializationTimeout: number
  onSerialized?: (project: Project) => void
  onPlayingChange?: (isPlaying: boolean) => void
}

export type EditorGate = ReturnType<typeof createEditorGate>

export const createEditorGate = createFactory(() => {
  const Gate = createGate<EditorProps>()

  const $props = Gate.state as Store<EditorProps | undefined>
  const $isOpened = Gate.status

  const $isReadonly = combine($isOpened, $props, (opened, props) => !opened || !props || props.readonly)
  const $isExternalLoading = combine($props, props => props?.externalLoading ?? false)

  const opened = sample({ clock: $isOpened, filter: $isOpened })

  const closed = sample({ clock: $isOpened, filter: not($isOpened) })

  return {
    $isExternalLoading,
    $isOpened: readonly($isOpened),
    $isReadonly: readonly($isReadonly),
    $props: readonly($props),
    Gate,
    closed,
    opened,
  }
})

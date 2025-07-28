import * as synthModule from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, createEvent, sample } from 'effector'
import { and, equals, not, readonly } from 'patronum'
import type { CodeEditorStore } from './code-editor'
import type { JsRunnerStore } from './js-runner'
import type { SynthStore } from './synth'

type Params = {
  codeEditor: CodeEditorStore
  jsRunner: JsRunnerStore
  synth: SynthStore
}

export const createPlayback = createFactory((params: Params) => {
  const { codeEditor, jsRunner, synth } = params

  const userToggledPlayback = createEvent()

  const $status = combine(jsRunner.$state, synth.$isPlaying, (jsState, isPlaying) => {
    if (jsState === 'initializing') {
      return 'initializing' as const
    }

    if (isPlaying) {
      return 'playing' as const
    }

    return 'ready' as const
  })

  sample({
    clock: synth.$synth,
    target: jsRunner.jsModulesChanged,
    fn: synth => ({ synth: synthModule, 'synth/playground': { synth } }),
  })

  sample({
    clock: userToggledPlayback,
    filter: equals($status, 'ready'),
    source: codeEditor.$code,
    target: jsRunner.jsCodeSubmitted,
  })

  sample({
    clock: userToggledPlayback,
    filter: synth.$isPlaying,
    target: synth.reset,
  })

  sample({
    clock: jsRunner.jsCodeRan,
    filter: and(not(synth.$isPlaying), equals(jsRunner.$error, null)),
    target: synth.started,
  })

  sample({
    clock: combine({ isPlaying: synth.$isPlaying, jsState: jsRunner.$state }),
    target: codeEditor.$isReadonly,
    fn: ({ isPlaying, jsState }) => isPlaying || jsState === 'running',
  })

  return {
    $status: readonly($status),
    userToggledPlayback,
  }
})

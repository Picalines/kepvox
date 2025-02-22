import * as synthModule from '@repo/synth'
import { invoke } from '@withease/factories'
import { combine, createEvent, sample } from 'effector'
import { createGate } from 'effector-react'
import { persist as persistInQuery } from 'effector-storage/query'
import { equals } from 'patronum'
import { base64Url } from '#shared/lib/base64-url'
import { createCodeEditor } from './code-editor'
import { createExampleSelector } from './examples'
import { createJsRunner } from './js-runner'
import { createSynth } from './synth'

const Gate = createGate()

const { $example, exampleSelected } = invoke(createExampleSelector)

const { $code, $isReadonly, codeChanged } = invoke(createCodeEditor)

const {
  $synthContext,
  $isPlaying,
  $elapsedSeconds,
  $elapsedNotes,
  initialized: synthSetup,
  started: synthStarted,
  reset: synthReset,
} = invoke(createSynth)

const {
  $state: $jsState,
  $error,
  initialized: jsRunnerSetup,
  jsCodeChanged,
  jsModulesChanged,
  jsCodeRan,
} = invoke(createJsRunner)

const playbackToggled = createEvent()

const $status = combine($jsState, $isPlaying, (jsState, isPlaying) => {
  if (!jsState) {
    return 'initializing' as const
  }

  if (isPlaying) {
    return 'playing' as const
  }

  return 'ready' as const
})

sample({
  clock: Gate.open,
  target: [jsRunnerSetup, synthSetup],
})

sample({
  clock: Gate.close,
  target: synthReset,
})

sample({
  clock: $synthContext,
  target: jsModulesChanged,
  fn: context => ({ synth: synthModule, 'synth/playground': { context } }),
})

sample({
  clock: playbackToggled,
  filter: equals($status, 'ready'),
  source: $code,
  target: jsCodeChanged,
})

sample({
  clock: playbackToggled,
  filter: $isPlaying,
  target: synthReset,
})

sample({
  clock: jsCodeChanged,
  target: jsCodeRan,
})

sample({
  clock: $jsState,
  filter: equals($jsState, 'success'),
  target: synthStarted,
})

sample({
  clock: combine({ isPlaying: $isPlaying, jsState: $jsState }),
  target: $isReadonly,
  fn: ({ isPlaying, jsState }) => isPlaying || jsState === 'running',
})

sample({
  clock: $example,
  target: codeChanged,
  fn: ({ code }) => code,
})

persistInQuery({
  key: 'code',
  source: $code,
  pickup: Gate.open,
  target: codeChanged,
  serialize: base64Url.encode,
  deserialize: base64Url.decode,
  timeout: 10,
})

export {
  Gate,
  $code,
  $isReadonly,
  $error,
  $status,
  $example,
  $elapsedSeconds,
  $elapsedNotes,
  exampleSelected,
  codeChanged,
  playbackToggled,
}

import * as synth from '@repo/synth'
import { invoke } from '@withease/factories'
import { combine, createEvent, sample } from 'effector'
import { persist as persistInQuery } from 'effector-storage/query'
import { equals } from 'patronum'
import { base64Url } from '#shared/lib/base64-url'
import { createCodeEditor } from './code-editor'
import { createExampleSelector } from './examples'
import { createJsRunner } from './js-runner'
import { createSynth } from './synth'

const { $exampleName, $exampleCode, exampleSelected } = invoke(createExampleSelector)

const { $code, $isReadonly, codeChanged } = invoke(createCodeEditor, { defaultCode: $exampleCode.getState() })

const { $synthContext, $isPlaying, started: synthStarted, reset: resetSynth } = invoke(createSynth)

const {
  initialized,
  $state: $jsState,
  $error,
  codeSubmitted,
} = invoke(createJsRunner, {
  modules: { synth: () => synth, 'synth/playground': () => ({ context: $synthContext.getState() }) },
})

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
  clock: playbackToggled,
  filter: equals($status, 'ready'),
  source: $code,
  target: codeSubmitted,
})

sample({
  clock: $jsState,
  filter: equals($jsState, 'success'),
  target: synthStarted,
})

sample({
  clock: playbackToggled,
  filter: $isPlaying,
  target: resetSynth,
})

sample({
  clock: combine({ isPlaying: $isPlaying, jsState: $jsState }),
  target: $isReadonly,
  fn: ({ isPlaying, jsState }) => isPlaying || jsState === 'running',
})

sample({
  clock: $exampleCode,
  target: codeChanged,
})

persistInQuery({
  key: 'code',
  source: $code,
  target: codeChanged,
  serialize: base64Url.encode,
  deserialize: base64Url.decode,
  timeout: 100,
})

export {
  $code,
  $isReadonly,
  $error,
  $status,
  $exampleName as $example,
  exampleSelected,
  codeChanged,
  playbackToggled,
  initialized,
}

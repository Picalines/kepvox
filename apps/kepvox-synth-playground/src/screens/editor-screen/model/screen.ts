import * as synthModule from '@repo/synth'
import { invoke } from '@withease/factories'
import { combine, createEvent, createStore, sample } from 'effector'
import { persist as persistInQuery } from 'effector-storage/query'
import { equals } from 'patronum'
import { base64Url } from '#shared/lib/base64-url'
import { createCodeEditor } from './code-editor'
import { createJsRunner } from './js-runner'

const codeEditor = invoke(createCodeEditor)

const jsRunner = invoke(createJsRunner, {
  modules: { synth: synthModule },
})

const { $code, codeChanged } = codeEditor
const { startup, $status: $runnerStatus, $error } = jsRunner

const playbackToggled = createEvent()

// TODO: hook up to SynthContext
const $isPlaying = createStore(false)

const $status = combine($runnerStatus, $isPlaying, (runnerStatus, isPlaying) => {
  if (!runnerStatus) {
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
  target: jsRunner.codeSubmitted,
})

sample({
  clock: $runnerStatus,
  filter: equals($runnerStatus, 'success'),
  target: $isPlaying,
  fn: () => true,
})

sample({
  clock: playbackToggled,
  filter: $isPlaying,
  target: $isPlaying,
  fn: () => false,
})

persistInQuery({
  key: 'code',
  source: $code,
  target: codeChanged,
  serialize: base64Url.encode,
  deserialize: base64Url.decode,
  timeout: 100,
})

export { $code, $error, $status, codeChanged, playbackToggled, startup }

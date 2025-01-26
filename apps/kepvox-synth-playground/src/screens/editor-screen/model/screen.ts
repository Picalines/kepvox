import * as synthModule from '@repo/synth'
import { invoke } from '@withease/factories'
import { combine, createEvent, createStore, sample } from 'effector'
import { equals } from 'patronum'
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

export { $code, $error, $status, codeChanged, playbackToggled, startup }

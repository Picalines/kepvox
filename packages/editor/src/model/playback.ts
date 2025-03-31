import { SynthContext, type SynthState } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, createEffect, createEvent, createStore, restore, sample, scopeBind } from 'effector'
import { equals, interval, not, readonly, spread } from 'patronum'
import type { EditorGate } from './gate'

export type PlaybackStore = ReturnType<typeof createPlayback>

type Params = {
  gate: EditorGate
}

export const createPlayback = createFactory((params: Params) => {
  const { gate } = params

  const stateChanged = createEvent<SynthState>()

  const $hasAudioPermission = createStore(true) // Assume that it's there
  const $context = createStore<SynthContext | null>(null)
  const $state = restore(stateChanged, 'disposed')
  const $elapsedSeconds = createStore(0)
  const $elapsedNotes = createStore(0)

  const audioPermissionGranted = createEvent()
  const initialized = createEvent<SynthContext>()
  const playbackStarted = createEvent()
  const playbackStopped = createEvent()
  const disposed = createEvent()

  const AUDIO_NOT_ALLOWED = new Error()

  const initContextFx = createEffect(async () => {
    if (typeof window === 'undefined') {
      return null
    }

    const audioContext = new AudioContext()
    if (audioContext.state === 'suspended') {
      throw AUDIO_NOT_ALLOWED
    }

    const synthContext = new SynthContext(audioContext)

    const scopedStateChanged = scopeBind(stateChanged)
    synthContext.stateChanged.watch(() => scopedStateChanged(synthContext.state))

    return synthContext
  })

  const playFx = attach({
    source: $context,
    effect: context => context?.play(),
  })

  const stopFx = attach({
    source: $context,
    effect: context => context?.stop(),
  })

  const disposeFx = attach({
    source: $context,
    effect: context => context?.dispose(),
  })

  sample({
    clock: gate.open,
    target: initContextFx,
  })

  sample({
    clock: gate.close,
    target: disposed,
  })

  sample({
    clock: initContextFx.failData,
    filter: error => error === AUDIO_NOT_ALLOWED,
    target: $hasAudioPermission,
    fn: () => false,
  })

  sample({
    clock: audioPermissionGranted,
    filter: not($hasAudioPermission),
    target: spread({ hasAudioPermission: $hasAudioPermission, init: initContextFx }),
    fn: () => ({ hasAudioPermission: true, init: undefined }),
  })

  sample({
    clock: initContextFx.doneData,
    target: $context,
  })

  sample({
    clock: $context,
    filter: Boolean,
    target: initialized,
  })

  sample({
    clock: $context,
    filter: Boolean,
    fn: context => context.state,
    target: $state,
  })

  sample({
    clock: playbackStarted,
    filter: not(equals($state, 'disposed')),
    target: playFx,
  })

  sample({
    clock: playbackStopped,
    target: stopFx,
  })

  sample({
    clock: disposed,
    target: disposeFx,
  })

  const $isPlaying = $state.map(state => state === 'playing')

  const { tick } = interval({
    timeout: 50,
    start: sample({ clock: $isPlaying, filter: $isPlaying }),
    stop: sample({ clock: $isPlaying, filter: not($isPlaying) }),
    leading: true,
    trailing: true,
  })

  sample({
    clock: tick,
    source: $context,
    fn: context => ({
      elapsedSeconds: context?.elapsedSeconds ?? 0,
      elapsedNotes: context?.elapsedNotes ?? 0,
    }),
    target: spread({
      elapsedSeconds: $elapsedSeconds,
      elapsedNotes: $elapsedNotes,
    }),
  })

  return {
    $hasAudioPermission: readonly($hasAudioPermission),
    $context: readonly($context),
    $state: readonly($state),
    $elapsedSeconds: readonly($elapsedSeconds),
    $elapsedNotes: readonly($elapsedNotes),
    audioPermissionGranted,
    initialized,
    playbackStarted,
    playbackStopped,
    disposed,
  }
})

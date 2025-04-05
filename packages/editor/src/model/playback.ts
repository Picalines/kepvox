import { Notes, SynthContext, type SynthState, SynthTime } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, combine, createEffect, createEvent, createStore, restore, sample, scopeBind } from 'effector'
import { and, condition, equals, interval, not, readonly, spread } from 'patronum'
import type { EditorGate } from './gate'

export type PlaybackStore = ReturnType<typeof createPlayback>

const DEFAULT_DURATION = Notes.orThrow(1)

type Params = {
  gate: EditorGate
}

export const createPlayback = createFactory((params: Params) => {
  const { gate } = params

  const stateChanged = createEvent<SynthState>()

  const $hasAudioPermission = createStore(true) // Assume that it's there
  const $context = createStore<SynthContext | null>(null)
  const $state = restore(stateChanged, 'disposed')
  const $isPlaying = $state.map(state => state === 'playing')
  const $isDisposed = $state.map(state => state === 'disposed')
  const $duration = createStore(DEFAULT_DURATION)
  const $elapsedNotes = createStore(Notes.orThrow(0))

  const audioPermissionGranted = createEvent()
  const initialized = createEvent<SynthContext>()
  const started = createEvent()
  const stopped = createEvent()
  const playheadSet = createEvent<{ progress: number }>()
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
    source: { context: $context, elapsedNotes: $elapsedNotes },
    effect: async ({ context, elapsedNotes }) => {
      context?.play(SynthTime.fromNotes(elapsedNotes))
    },
  })

  const stopFx = attach({
    source: $context,
    effect: context => context?.stop(),
  })

  const disposeFx = attach({
    source: $context,
    effect: context => context?.dispose(),
  })

  condition({
    source: gate.status,
    if: gate.status,
    then: initContextFx,
    else: disposed,
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

  sample({ clock: initContextFx.doneData, target: $context })

  sample({ clock: $context, filter: Boolean, target: initialized })

  sample({
    clock: $context,
    filter: Boolean,
    target: $state,
    fn: ({ state }) => state,
  })

  const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

  const $progress = combine($duration, $elapsedNotes, (duration, elapsedNotes) => clamp01(elapsedNotes / duration))

  sample({
    clock: started,
    filter: equals($progress, 1),
    target: $elapsedNotes,
    fn: () => Notes.orThrow(0),
  })

  sample({ clock: started, filter: not($isDisposed), target: playFx })
  sample({ clock: stopped, target: stopFx })
  sample({ clock: disposed, target: disposeFx })

  const { tick } = interval({
    timeout: 50,
    start: sample({ clock: $isPlaying, filter: $isPlaying }),
    stop: sample({ clock: $isPlaying, filter: not($isPlaying) }),
    leading: true,
    trailing: false,
  })

  sample({
    clock: tick,
    source: $context,
    filter: Boolean,
    target: $elapsedNotes,
    fn: ({ elapsedNotes }) => elapsedNotes,
  })

  sample({
    clock: playheadSet,
    filter: not($isPlaying),
    source: $duration,
    target: $elapsedNotes,
    fn: (duration, { progress }) => Notes.orThrow(duration * clamp01(progress)),
  })

  sample({
    clock: $progress,
    filter: and($isPlaying, equals($progress, 1)),
    target: stopped,
  })

  return {
    $hasAudioPermission: readonly($hasAudioPermission),
    $context: readonly($context),
    $isPlaying: readonly($isPlaying),
    $progress: readonly($progress),
    audioPermissionGranted,
    initialized,
    started,
    stopped,
    playheadSet,
    disposed,
  }
})

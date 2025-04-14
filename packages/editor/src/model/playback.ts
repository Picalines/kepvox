import { SynthContext, type SynthState, SynthTime } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, combine, createEffect, createEvent, createStore, restore, sample, scopeBind } from 'effector'
import { and, condition, interval, not, readonly, spread } from 'patronum'
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
  const $duration = createStore(SynthTime.note)
  const $playhead = createStore(SynthTime.start)

  const userGrantedAudioPermission = createEvent()
  const userSetPlayhead = createEvent<SynthTime>()

  const initialized = createEvent<SynthContext>()
  const started = createEvent()
  const stopped = createEvent()
  const durationSet = createEvent<SynthTime>()
  const disposed = createEvent()

  const $isIdle = combine($state, state => state === 'idle')
  const $isPlaying = combine($state, state => state === 'playing')

  const AUDIO_NOT_ALLOWED = new Error()

  const initContextFx = createEffect(() => {
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
    source: { context: $context, playhead: $playhead },
    effect: ({ context, playhead }) => context?.play(playhead),
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
    clock: $isPlaying,
    target: attach({
      source: { editorProps: gate.$props, isPlaying: $isPlaying },
      effect: ({ editorProps, isPlaying }) => editorProps?.onPlayingChange?.(isPlaying),
    }),
  })

  condition({
    source: gate.$isOpened,
    if: gate.$isOpened,
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
    clock: userGrantedAudioPermission,
    filter: not($hasAudioPermission),
    target: spread({ hasAudioPermission: $hasAudioPermission, init: initContextFx }),
    fn: () => ({ hasAudioPermission: true, init: undefined }),
  })

  sample({ clock: initContextFx.doneData, target: $context })

  sample({
    clock: $context,
    filter: Boolean,
    target: spread({ initialized, state: $state }),
    fn: context => ({ initialized: context, state: context.state }),
  })

  const $isPlayheadAtEnd = combine($duration, $playhead, (duration, playhead) => playhead.isAfterOrAt(duration))

  sample({
    clock: started,
    filter: $isPlayheadAtEnd,
    target: $playhead,
    fn: () => SynthTime.start,
  })

  sample({ clock: started, filter: $isIdle, target: playFx })
  sample({ clock: stopped, filter: $isPlaying, target: stopFx })
  sample({ clock: disposed, target: disposeFx })

  const { tick } = interval({
    timeout: 16,
    start: sample({ clock: $isPlaying, filter: $isPlaying }),
    stop: sample({ clock: $isIdle, filter: $isIdle }),
    leading: true,
    trailing: false,
  })

  sample({
    clock: tick,
    source: $context,
    filter: Boolean,
    target: $playhead,
    fn: ({ elapsedNotes }) => SynthTime.fromNotes(elapsedNotes),
  })

  sample({ clock: durationSet, filter: $isIdle, target: $duration })

  sample({
    clock: userSetPlayhead,
    filter: $isIdle,
    source: $duration,
    target: $playhead,
    fn: (duration, time) => SynthTime.start.max(duration.min(time)),
  })

  sample({
    clock: $isPlayheadAtEnd,
    filter: and($isPlaying, $isPlayheadAtEnd),
    target: stopped,
  })

  return {
    $context: readonly($context),
    $hasAudioPermission: readonly($hasAudioPermission),
    $isIdle: readonly($isIdle),
    $isPlaying: readonly($isPlaying),
    $playhead: readonly($playhead),
    disposed,
    durationSet,
    initialized,
    started,
    stopped,
    userGrantedAudioPermission,
    userSetPlayhead,
  }
})

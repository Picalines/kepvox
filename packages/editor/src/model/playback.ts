import { Synth, type SynthState, Time } from '@repo/synth'
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
  const $synth = createStore<Synth | null>(null)
  const $state = restore(stateChanged, 'disposed')
  const $duration = createStore(Time.note)
  const $playhead = createStore(Time.start)

  const userGrantedAudioPermission = createEvent()
  const userSetPlayhead = createEvent<Time>()

  const initialized = createEvent<Synth>()
  const started = createEvent()
  const stopped = createEvent()
  const durationSet = createEvent<Time>()
  const disposed = createEvent()

  const $isIdle = combine($state, state => state === 'idle')
  const $isPlaying = combine($state, state => state === 'playing')

  const AUDIO_NOT_ALLOWED = new Error()

  const initFx = createEffect(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const audioContext = new AudioContext()
    if (audioContext.state === 'suspended') {
      throw AUDIO_NOT_ALLOWED
    }

    const synth = new Synth(audioContext)

    const scopedStateChanged = scopeBind(stateChanged)
    synth.stateChanged.watch(() => scopedStateChanged(synth.state))

    return synth
  })

  const playFx = attach({
    source: { synth: $synth, playhead: $playhead },
    effect: ({ synth, playhead }) => synth?.play(playhead),
  })

  const stopFx = attach({
    source: $synth,
    effect: synth => synth?.stop(),
  })

  const disposeFx = attach({
    source: $synth,
    effect: synth => synth?.dispose(),
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
    then: initFx,
    else: disposed,
  })

  sample({
    clock: initFx.failData,
    filter: error => error === AUDIO_NOT_ALLOWED,
    target: $hasAudioPermission,
    fn: () => false,
  })

  sample({
    clock: userGrantedAudioPermission,
    filter: not($hasAudioPermission),
    target: spread({ hasAudioPermission: $hasAudioPermission, init: initFx }),
    fn: () => ({ hasAudioPermission: true, init: undefined }),
  })

  sample({ clock: initFx.doneData, target: $synth })

  sample({
    clock: $synth,
    filter: Boolean,
    target: spread({ initialized, state: $state }),
    fn: synth => ({ initialized: synth, state: synth.state }),
  })

  const $isPlayheadAtEnd = combine($duration, $playhead, (duration, playhead) => playhead.isAfterOrAt(duration))

  sample({
    clock: started,
    filter: $isPlayheadAtEnd,
    target: $playhead,
    fn: () => Time.start,
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
    source: $synth,
    filter: Boolean,
    target: $playhead,
    fn: ({ elapsedNotes }) => Time.atNote(elapsedNotes),
  })

  sample({ clock: durationSet, filter: $isIdle, target: $duration })

  sample({
    clock: userSetPlayhead,
    filter: $isIdle,
    source: $duration,
    target: $playhead,
    fn: (duration, time) => Time.start.max(duration.min(time)),
  })

  sample({
    clock: $isPlayheadAtEnd,
    filter: and($isPlaying, $isPlayheadAtEnd),
    target: stopped,
  })

  return {
    $hasAudioPermission: readonly($hasAudioPermission),
    $isIdle: readonly($isIdle),
    $isPlaying: readonly($isPlaying),
    $playhead: readonly($playhead),
    $synth: readonly($synth),
    disposed,
    durationSet,
    initialized,
    started,
    stopped,
    userGrantedAudioPermission,
    userSetPlayhead,
  }
})

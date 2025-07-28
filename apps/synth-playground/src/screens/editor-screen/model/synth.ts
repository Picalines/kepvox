import { Synth, type SynthState } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, createEffect, createEvent, createStore, restore, sample, scopeBind } from 'effector'
import type { Gate } from 'effector-react'
import { interval, not, readonly, spread } from 'patronum'

export type SynthStore = ReturnType<typeof createSynth>

type Params = {
  gate: Gate
}

export const createSynth = createFactory((params: Params) => {
  const { gate } = params

  const stateChanged = createEvent<SynthState>()

  const $synth = createStore<Synth | null>(null)

  const $state = restore(stateChanged, 'disposed')
  const $isPlaying = $state.map(state => state === 'playing')

  const $elapsedSeconds = createStore(0)
  const $elapsedNotes = createStore(0)

  const started = createEvent()
  const reset = createEvent()

  const initFx = createEffect(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const synth = new Synth(new AudioContext())

    const scopedStateChanged = scopeBind(stateChanged)
    synth.stateChanged.watch(() => scopedStateChanged(synth.state))

    return synth
  })

  const playFx = attach({
    source: $synth,
    effect: synth => synth?.play(),
  })

  const disposeFx = attach({
    source: $synth,
    effect: synth => synth?.dispose(),
  })

  sample({ clock: gate.open, target: initFx })
  sample({ clock: initFx.doneData, target: $synth })
  sample({ clock: gate.close, target: disposeFx })

  sample({ clock: reset, target: disposeFx })
  sample({ clock: disposeFx.finally, target: initFx })

  sample({ clock: started, target: playFx })

  const { tick } = interval({
    timeout: 50,
    start: sample({ clock: $isPlaying, filter: $isPlaying }),
    stop: sample({ clock: $isPlaying, filter: not($isPlaying) }),
    leading: true,
    trailing: true,
  })

  sample({
    clock: tick,
    source: $synth,
    fn: synth => ({
      elapsedSeconds: synth?.elapsedSeconds ?? 0,
      elapsedNotes: synth?.elapsedNotes ?? 0,
    }),
    target: spread({
      elapsedSeconds: $elapsedSeconds,
      elapsedNotes: $elapsedNotes,
    }),
  })

  return {
    $elapsedNotes: readonly($elapsedNotes),
    $elapsedSeconds: readonly($elapsedSeconds),
    $isPlaying: readonly($isPlaying),
    $synth: readonly($synth),
    reset,
    started,
  }
})

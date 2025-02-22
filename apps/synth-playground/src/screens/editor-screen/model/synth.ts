import { SynthContext, type SynthState } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, createEffect, createEvent, createStore, restore, sample, scopeBind } from 'effector'
import { interval, not, readonly, spread } from 'patronum'

export const createSynth = createFactory(() => {
  const stateChanged = createEvent<SynthState>()

  const $synthContext = createStore<SynthContext | null>(null)

  const $state = restore(stateChanged, 'disposed')
  const $isPlaying = $state.map(state => state === 'playing')

  const $elapsedSeconds = createStore(0)
  const $elapsedNotes = createStore(0)

  const initialized = createEvent()
  const started = createEvent()
  const reset = createEvent()

  const initContextFx = createEffect(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const synthContext = new SynthContext(new AudioContext())

    const scopedStateChanged = scopeBind(stateChanged)
    synthContext.stateChanged.watch(() => scopedStateChanged(synthContext.state))

    return synthContext
  })

  const playFx = attach({
    source: $synthContext,
    effect: synthContext => synthContext?.play(),
  })

  const disposeFx = attach({
    source: $synthContext,
    effect: synthContext => synthContext?.dispose(),
  })

  sample({
    clock: initialized,
    target: initContextFx,
  })

  sample({
    clock: started,
    target: playFx,
  })

  sample({
    clock: reset,
    target: disposeFx,
  })

  sample({
    clock: disposeFx.finally,
    target: initContextFx,
  })

  sample({
    clock: initContextFx.doneData,
    target: $synthContext,
  })

  const { tick } = interval({
    timeout: 50,
    start: sample({ clock: $isPlaying, filter: $isPlaying }),
    stop: sample({ clock: $isPlaying, filter: not($isPlaying) }),
    leading: true,
    trailing: true,
  })

  sample({
    clock: tick,
    source: $synthContext,
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
    $isPlaying: readonly($isPlaying),
    $synthContext: readonly($synthContext),
    $elapsedSeconds: readonly($elapsedSeconds),
    $elapsedNotes: readonly($elapsedNotes),
    initialized,
    started,
    reset,
  }
})

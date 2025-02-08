import { SynthContext, type SynthState } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, createEvent, createStore, restore, sample } from 'effector'
import { readonly } from 'patronum'

export const createSynth = createFactory(() => {
  const stateChanged = createEvent<SynthState>()

  const createSynthContext = (): SynthContext | null => {
    if (typeof window === 'undefined') {
      return null
    }

    const synthContext = new SynthContext(new AudioContext())

    synthContext.stateChanged.watch(() => stateChanged(synthContext.state))

    return synthContext
  }

  const $synthContext = createStore(createSynthContext())

  const $state = restore(stateChanged, 'disposed')
  const $isPlaying = $state.map(state => state === 'playing')

  const started = createEvent()
  const reset = createEvent()

  const playFx = attach({
    source: $synthContext,
    effect: synthContext => synthContext?.play(),
  })

  const disposeFx = attach({
    source: $synthContext,
    effect: synthContext => synthContext?.dispose(),
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
    target: $synthContext,
    fn: createSynthContext,
  })

  return {
    $isPlaying: readonly($isPlaying),
    $synthContext: readonly($synthContext),
    started,
    reset,
  }
})

import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { CurveSynthParam, NumberSynthParam } from '#param'
import { Factor, Normal, Seconds } from '#units'
import { SynthNode } from '../synth-node'

export class ReverbSynthNode extends SynthNode {
  readonly dry
  readonly wet

  readonly duration
  readonly decay

  constructor(context: SynthContext) {
    const audioContext = context[INTERNAL_AUDIO_CONTEXT]

    const input = audioContext.createGain()
    const output = audioContext.createGain()

    const dryGain = audioContext.createGain()
    const wetGain = audioContext.createGain()
    const convolver = audioContext.createConvolver()

    input.connect(dryGain).connect(output)
    input.connect(convolver).connect(wetGain).connect(output)

    super({ context, inputs: [input], outputs: [output] })

    this.dry = new CurveSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.max,
      automate: { param: dryGain.gain },
    })

    this.wet = new CurveSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.max,
      automate: { param: wetGain.gain },
    })

    this.duration = new NumberSynthParam({
      node: this,
      unit: 'seconds',
      initialValue: Seconds.orThrow(1),
      range: Range.positive,
    })

    this.decay = new NumberSynthParam({
      node: this,
      unit: 'factor',
      initialValue: Factor.orThrow(2),
      range: Range.positiveNonZero,
    })

    const updateImpulseBuffer = () => {
      convolver.buffer = makeImpulseBuffer({
        audioContext,
        random: this.context.random,
        seconds: this.duration.value,
        decay: this.decay.value,
      })
    }

    this.duration.changed.watch(updateImpulseBuffer)
    this.decay.changed.watch(updateImpulseBuffer)
    updateImpulseBuffer()
  }
}

type ImpulseBufferParams = {
  audioContext: AudioContext | OfflineAudioContext
  random: () => number
  seconds: Seconds
  decay: number
}

const makeImpulseBuffer = (params: ImpulseBufferParams) => {
  const { audioContext, random, seconds, decay } = params

  const sampleRate = audioContext.sampleRate
  const samplesNumber = Math.floor(sampleRate * seconds)

  const impulse = audioContext.createBuffer(2, samplesNumber, sampleRate)
  const impulseL = impulse.getChannelData(0)
  const impulseR = impulse.getChannelData(1)

  for (let sampleIndex = 0; sampleIndex < samplesNumber; sampleIndex++) {
    impulseL[sampleIndex] = (random() * 2 - 1) * (1 - sampleIndex / samplesNumber) ** decay
    impulseR[sampleIndex] = (random() * 2 - 1) * (1 - sampleIndex / samplesNumber) ** decay
  }

  return impulse
}

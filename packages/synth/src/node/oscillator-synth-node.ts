import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { EnumSynthParam, ScalarSynthParam } from '#param'
import { Pitch } from '#pitch'
import { SYNTH_NODE_TYPE, SynthNode } from './synth-node'

const WAVE_SPAHE = ['sine', 'square', 'sawtooth', 'triangle'] as const

export class OscillatorSynthNode extends SynthNode {
  readonly [SYNTH_NODE_TYPE] = 'oscillator'

  readonly waveShape: EnumSynthParam<(typeof WAVE_SPAHE)[number]>
  readonly frequency: ScalarSynthParam<'hertz'>

  constructor(context: SynthContext) {
    const oscillator = context[INTERNAL_AUDIO_CONTEXT].createOscillator()
    const gate = context[INTERNAL_AUDIO_CONTEXT].createGain()

    oscillator.connect(gate)
    oscillator.start()

    super({ context, inputs: [], outputs: [gate] })

    this.waveShape = new EnumSynthParam({
      node: this,
      variants: WAVE_SPAHE,
      initialValue: 'sine',
      synchronize: shape => {
        oscillator.type = shape
      },
    })

    this.frequency = new ScalarSynthParam({
      node: this,
      audioParam: oscillator.frequency,
      unit: 'hertz',
      initialValue: Pitch.frequency('A4'),
    })

    const unmuteOscillator = () => {
      gate.gain.value = 1
    }

    const muteOscillator = () => {
      gate.gain.value = 0
    }

    muteOscillator()

    this.context.playing.watchUntil(this.disposed, unmuteOscillator)
    this.context.stopped.watchUntil(this.disposed, muteOscillator)

    this.disposed.watch(() => oscillator.stop())
  }
}

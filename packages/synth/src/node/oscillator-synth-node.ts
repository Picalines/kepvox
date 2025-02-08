import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { AudioSynthParam, EnumSynthParam } from '#param'
import { Unit } from '#units'
import { SynthNode, synthNodeType } from './synth-node'

const WAVE_SPAHE = ['sine', 'square', 'sawtooth', 'triangle'] as const

export class OscillatorSynthNode extends SynthNode {
  readonly [synthNodeType] = 'oscillator'

  readonly waveShape: EnumSynthParam<(typeof WAVE_SPAHE)[number]>
  readonly frequency: AudioSynthParam<'hertz'>

  constructor(context: SynthContext) {
    const oscillator = context[INTERNAL_AUDIO_CONTEXT].createOscillator()
    const gate = context[INTERNAL_AUDIO_CONTEXT].createGain()

    oscillator.connect(gate)
    oscillator.start()

    super({ context, inputs: [], outputs: [gate] })

    this.waveShape = new EnumSynthParam({
      variants: WAVE_SPAHE,
      initialValue: 'sine',
      synchronize: shape => {
        oscillator.type = shape
      },
    })

    this.frequency = new AudioSynthParam({
      context,
      audioParam: oscillator.frequency,
      unit: 'hertz',
      initialValue: Unit.hertz.orThrow(440), // TODO: set to constant
    })

    const unmuteOscillator = () => {
      gate.gain.value = 1
    }

    const muteOscillator = () => {
      gate.gain.value = 0
    }

    muteOscillator()

    this.context.on('play', unmuteOscillator, { signal: this.disposed })
    this.context.on('stop', muteOscillator, { signal: this.disposed })

    this.disposed.addEventListener('abort', () => this.frequency.dispose(), { once: true })
    this.disposed.addEventListener('abort', () => oscillator.stop(), { once: true })
  }
}

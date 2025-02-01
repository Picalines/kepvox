import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { AudioSynthParam, EnumSynthParam } from '#param'
import { SynthNode, synthNodeType } from './synth-node'

export class OscillatorSynthNode extends SynthNode {
  readonly [synthNodeType] = 'oscillator'

  readonly waveShape // see in constructor
  readonly frequency

  readonly #oscillator: OscillatorNode

  constructor(context: SynthContext) {
    const oscillator = context[INTERNAL_AUDIO_CONTEXT].createOscillator()
    const gate = context[INTERNAL_AUDIO_CONTEXT].createGain()

    oscillator.connect(gate)

    super({ context, inputs: [], outputs: [gate] })

    this.#oscillator = oscillator

    this.waveShape = new EnumSynthParam({
      variants: ['sine', 'square', 'sawtooth', 'triangle'] as const,
      initialValue: 'sine',
      synchronize: shape => {
        oscillator.type = shape
      },
    })

    this.frequency = new AudioSynthParam(oscillator.frequency, {
      context,
      unit: 'hertz',
      initialValue: 440, // TODO: set to constant
    })

    this.#oscillator.start()

    gate.gain.value = 0

    this.context.on(
      'play',
      () => {
        gate.gain.value = 1
      },
      { signal: this.context.disposed }, // TODO: make this default
    )

    this.context.on(
      'stop',
      () => {
        gate.gain.value = 0
      },
      { signal: this.context.disposed },
    )
  }

  override dispose(): void {
    super.dispose()
    this.#oscillator.stop()
  }
}

import type { SynthContext } from '#context'
import { AudioSynthParam, EnumSynthParam } from '#param'
import { SynthNode, synthNodeType } from './synth-node'

export class OscillatorSynthNode extends SynthNode {
  readonly [synthNodeType] = 'oscillator'

  readonly waveShape // see in constructor
  readonly frequency

  #oscillator: OscillatorNode

  constructor(context: SynthContext) {
    const { audioContext } = context

    const oscillator = audioContext.createOscillator()

    super({ context, inputs: [oscillator], outputs: [oscillator] })

    this.#oscillator = oscillator

    this.waveShape = new EnumSynthParam({
      variants: ['sine', 'square', 'sawtooth', 'triangle'] as const,
      initialValue: 'sine',
      synchronize: shape => {
        oscillator.type = shape
      },
    })

    this.frequency = new AudioSynthParam(oscillator.frequency, {
      unit: 'hertz',
      initialValue: 440, // TODO: set to constant
    })

    this.#oscillator.start()
  }

  override dispose(): void {
    super.dispose()
    this.#oscillator.stop()
    this.#oscillator.disconnect()
  }
}

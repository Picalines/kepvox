import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { CurveSynthParam, EnumSynthParam } from '#param'
import { Pitch } from '#pitch'
import { SYNTH_NODE_TYPE, SynthNode } from '../synth-node'

const WAVE_SPAHES = ['sine', 'square', 'sawtooth', 'triangle'] as const

export class OscillatorSynthNode extends SynthNode {
  readonly [SYNTH_NODE_TYPE] = 'oscillator'

  readonly waveShape: EnumSynthParam<(typeof WAVE_SPAHES)[number]>
  readonly frequency: CurveSynthParam<'hertz'>

  constructor(context: SynthContext) {
    const audioContext = context[INTERNAL_AUDIO_CONTEXT]

    const oscillator = audioContext.createOscillator()
    const merger = audioContext.createChannelMerger(2)
    const gate = audioContext.createGain()

    oscillator.connect(merger, 0, 0)
    oscillator.connect(merger, 0, 1)
    merger.connect(gate)

    oscillator.start()

    super({ context, inputs: [], outputs: [gate] })

    this.waveShape = new EnumSynthParam({
      node: this,
      variants: WAVE_SPAHES,
      initialValue: 'sine',
    })

    const updateWaveShape = () => {
      oscillator.type = this.waveShape.value
    }

    this.waveShape.valueChanged.watch(updateWaveShape)
    updateWaveShape()

    this.frequency = new CurveSynthParam({
      node: this,
      unit: 'hertz',
      initialValue: Pitch.frequency('A4'),
      automate: { param: oscillator.frequency },
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

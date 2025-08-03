import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { CurveSynthParam, EnumSynthParam } from '#param'
import { Pitch } from '#pitch'
import type { Synth } from '#synth'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { SynthNode } from '../synth-node'

const WAVE_SPAHES = ['sine', 'square', 'sawtooth', 'triangle'] as const

export class OscillatorSynthNode extends SynthNode {
  readonly waveShape: EnumSynthParam<(typeof WAVE_SPAHES)[number]>
  readonly frequency: CurveSynthParam<'hertz'>

  constructor(synth: Synth) {
    const audioContext = synth[INTERNAL_AUDIO_CONTEXT]

    const oscillator = audioContext.createOscillator()
    const merger = audioContext.createChannelMerger(2)
    const master = audioContext.createGain()

    oscillator.connect(merger, 0, 0)
    oscillator.connect(merger, 0, 1)
    merger.connect(master)

    super({ synth, inputs: [], outputs: [master] })

    this.waveShape = new EnumSynthParam({
      node: this,
      variants: WAVE_SPAHES,
      initialValue: 'sine',
    })

    const updateWaveShape = () => {
      oscillator.type = this.waveShape.value
    }

    this.waveShape.changed.watch(updateWaveShape)
    updateWaveShape()

    this.frequency = new CurveSynthParam({
      node: this,
      unit: 'hertz',
      initialValue: Pitch.a4.hertz,
      automate: { param: oscillator.frequency },
    })

    synth.playing.toggle(
      this.disposed,
      () => oscillator.start(),
      () => oscillator.stop(),
    )

    master.gain.value = 0
    synth.playing.toggle(
      synth.stopped,
      () => {
        master.gain.value = DEFAULT_SOURCE_GAIN
      },
      () => {
        master.gain.value = 0
      },
    )
  }
}

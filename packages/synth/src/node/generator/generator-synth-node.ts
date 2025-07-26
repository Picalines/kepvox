import { assertedAt } from '@repo/common/assert'
import { isOneOf } from '@repo/common/predicate'
import { ADSRAutomationCurve, AutomationCurve, automateAudioParam } from '#automation'
import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { CurveSynthParam, EnumSynthParam } from '#param'
import { Pitch } from '#pitch'
import type { Time } from '#time'
import { type Hertz, Normal, Notes } from '#units'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { SynthNode } from '../synth-node'

export type GeneratorSynthNodeOpts = {
  /**
   * @default 16
   */
  maxPolyphony: number
}

type GeneratorVoice = {
  frequency: AutomationCurve<'hertz'>
  adsr: ADSRAutomationCurve
}

const WAVE_SPAHES = ['sine', 'square', 'sawtooth', 'triangle'] as const

export type GeneratorWaveShape = (typeof WAVE_SPAHES)[number]

export class GeneratorSynthNode extends SynthNode {
  readonly waveShape

  readonly attack
  readonly decay
  readonly sustain
  readonly release

  readonly #voices: GeneratorVoice[]

  constructor(context: SynthContext, opts?: GeneratorSynthNodeOpts) {
    const { maxPolyphony = 16 } = opts ?? {}

    const audioContext = context[INTERNAL_AUDIO_CONTEXT]

    const steroMerger = audioContext.createChannelMerger(2)
    const master = audioContext.createGain()

    steroMerger.connect(master)

    super({ context, inputs: [], outputs: [master] })

    this.attack = new CurveSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes(0),
      range: Range.positive,
    })

    this.decay = new CurveSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes(0),
      range: Range.positive,
    })

    this.sustain = new CurveSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.max,
    })

    this.release = new CurveSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes(0),
      range: Range.positive,
    })

    this.waveShape = new EnumSynthParam({
      node: this,
      variants: WAVE_SPAHES,
      initialValue: 'sine',
    })

    this.#voices = Array.from({ length: maxPolyphony }).map(() => {
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      gain.gain.value = 0

      oscillator.connect(gain)
      gain.connect(steroMerger, 0, 0)
      gain.connect(steroMerger, 0, 1)

      const frequency = new AutomationCurve({
        unit: 'hertz',
        initialValue: Pitch.frequency('C0'),
      })

      const adsr = new ADSRAutomationCurve({
        attack: this.attack.curve,
        decay: this.decay.curve,
        release: this.release.curve,
        sustain: this.sustain.curve,
      })

      automateAudioParam({
        context,
        audioParam: oscillator.frequency,
        curve: frequency,
        until: this.disposed,
      })

      automateAudioParam({
        context,
        audioParam: gain.gain,
        curve: adsr.gain,
        until: this.disposed,
      })

      const updateWaveShape = () => {
        oscillator.type = this.waveShape.value
      }

      updateWaveShape()
      this.waveShape.changed.watch(updateWaveShape)

      oscillator.start()
      this.disposed.watch(() => oscillator.stop())

      return { frequency, adsr }
    })

    const mute = () => {
      master.gain.value = 0
    }

    const unmute = () => {
      master.gain.value = DEFAULT_SOURCE_GAIN
    }

    mute()
    this.context.playing.watchUntil(this.disposed, unmute)
    this.context.stopped.watchUntil(this.disposed, mute)
  }

  attackAt(time: Time, frequency: Hertz) {
    const voice = this.#voices.find(voice => voice.adsr.state.valueAt(time) === 'idle') ?? assertedAt(this.#voices, 0)

    voice.frequency.holdValueAt(time)
    voice.frequency.setValueAt(time, frequency)
    voice.adsr.attackAt(time)
  }

  releaseAt(time: Time, frequency?: Hertz) {
    const voices =
      frequency === undefined
        ? this.#voices
        : [
            this.#voices.find(
              voice =>
                !isOneOf(voice.adsr.state.valueAt(time), ['idle', 'release']) &&
                voice.frequency.valueAt(time) === frequency,
            ),
          ]

    for (const voice of voices) {
      voice?.adsr.releaseAt(time)
    }
  }

  muteAt(time: Time) {
    for (const voice of this.#voices) {
      voice.adsr.muteAt(time)
      voice.frequency.holdValueAt(time)
    }
  }
}

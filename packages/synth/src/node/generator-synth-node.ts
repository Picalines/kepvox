import { ADSRAutomationCurve, AutomationCurve, automateAudioParam } from '#automation'
import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { EnumSynthParam, ScalarSynthParam } from '#param'
import type { SynthTime } from '#time'
import { Hertz, Normal, Notes } from '#units'
import { assertedAt } from '@repo/common/assert'
import { SYNTH_NODE_TYPE, SynthNode } from './synth-node'

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

// TODO: Unit.zero utility?
const INACTIVE_VOICE_FREQUENCY = Hertz.orThrow(0)

export class GeneratorSynthNode extends SynthNode {
  readonly [SYNTH_NODE_TYPE] = 'generator'

  readonly waveShape

  readonly attack
  readonly decay
  readonly sustain
  readonly release

  readonly #voices: GeneratorVoice[]

  constructor(context: SynthContext, opts?: GeneratorSynthNodeOpts) {
    const { maxPolyphony = 16 } = opts ?? {}

    const audioContext = context[INTERNAL_AUDIO_CONTEXT]

    const masterGain = audioContext.createGain()

    super({ context, inputs: [], outputs: [masterGain] })

    this.attack = new ScalarSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
    })

    this.decay = new ScalarSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
    })

    this.sustain = new ScalarSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.max,
    })

    this.release = new ScalarSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
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
      gain.connect(masterGain)

      const frequency = new AutomationCurve({
        unit: 'hertz',
        initialValue: INACTIVE_VOICE_FREQUENCY,
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
      this.waveShape.valueChanged.watch(updateWaveShape)

      oscillator.start()
      this.disposed.watch(() => oscillator.stop())

      return { frequency, adsr }
    })
  }

  attackAt(time: SynthTime, frequency: Hertz) {
    if (frequency === INACTIVE_VOICE_FREQUENCY) {
      return
    }

    const voice =
      this.#voices.find(
        voice =>
          voice.frequency.valueAt(time) === INACTIVE_VOICE_FREQUENCY &&
          voice.adsr.gain.rampDirectionAt(time) !== 'increasing',
      ) ?? assertedAt(this.#voices, 0)

    voice.frequency.holdValueAt(time)
    voice.frequency.setValueAt(time, frequency)
    voice.adsr.attackAt(time)
  }

  releaseAt(time: SynthTime, frequency: Hertz) {
    if (frequency === INACTIVE_VOICE_FREQUENCY) {
      return
    }

    const voice = this.#voices.find(
      voice => voice.frequency.valueAt(time) === frequency && voice.adsr.gain.rampDirectionAt(time) !== 'decreasing',
    )

    if (!voice) {
      return
    }

    const releaseEnd = voice.adsr.releaseAt(time)

    voice.frequency.holdValueAt(releaseEnd)
    voice.frequency.setValueAt(releaseEnd, INACTIVE_VOICE_FREQUENCY)
  }
}

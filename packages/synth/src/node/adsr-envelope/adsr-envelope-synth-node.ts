import { ADSRAutomationCurve, automateAudioParam } from '#automation'
import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { CurveSynthParam } from '#param'
import type { SynthTime } from '#time'
import { Normal, Notes } from '#units'
import { SynthNode } from '../synth-node'

export class ADSREnvelopeSynthNode extends SynthNode {
  readonly attack
  readonly decay
  readonly sustain
  readonly release

  readonly #adsrCurve

  constructor(context: SynthContext) {
    const gainNode = context[INTERNAL_AUDIO_CONTEXT].createGain()

    super({ context, inputs: [gainNode], outputs: [gainNode] })

    this.attack = new CurveSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
    })

    this.decay = new CurveSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
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
      initialValue: Notes.orThrow(0),
      range: Range.positive,
    })

    this.#adsrCurve = new ADSRAutomationCurve({
      attack: this.attack.curve,
      decay: this.decay.curve,
      sustain: this.sustain.curve,
      release: this.release.curve,
    })

    automateAudioParam({
      context,
      audioParam: gainNode.gain,
      curve: this.#adsrCurve.gain,
      until: this.disposed,
    })
  }

  attackAt(start: SynthTime) {
    this.#adsrCurve.attackAt(start)
  }

  releaseAt(start: SynthTime) {
    this.#adsrCurve.releaseAt(start)
  }
}

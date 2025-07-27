import { ADSRAutomationCurve, automateAudioParam } from '#automation'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { CurveSynthParam } from '#param'
import type { Synth } from '#synth'
import type { Time } from '#time'
import { Normal, Notes } from '#units'
import { SynthNode } from '../synth-node'

export class ADSREnvelopeSynthNode extends SynthNode {
  readonly attack
  readonly decay
  readonly sustain
  readonly release

  readonly #adsrCurve

  constructor(synth: Synth) {
    const gainNode = synth[INTERNAL_AUDIO_CONTEXT].createGain()

    super({ synth, inputs: [gainNode], outputs: [gainNode] })

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

    this.#adsrCurve = new ADSRAutomationCurve({
      attack: this.attack.curve,
      decay: this.decay.curve,
      sustain: this.sustain.curve,
      release: this.release.curve,
    })

    automateAudioParam({
      synth,
      audioParam: gainNode.gain,
      curve: this.#adsrCurve.gain,
      until: this.disposed,
    })
  }

  attackAt(start: Time) {
    this.#adsrCurve.attackAt(start)
  }

  releaseAt(start: Time) {
    this.#adsrCurve.releaseAt(start)
  }
}

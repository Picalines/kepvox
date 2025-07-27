import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { CurveSynthParam } from '#param'
import type { Synth } from '#synth'
import { Decibels, Factor } from '#units'
import { SynthNode } from '../synth-node'

export class GainSynthNode extends SynthNode {
  readonly decibels: CurveSynthParam<'decibels'>
  readonly factor: CurveSynthParam<'factor'>

  constructor(synth: Synth) {
    const decibelGain = synth[INTERNAL_AUDIO_CONTEXT].createGain()
    const factorGain = synth[INTERNAL_AUDIO_CONTEXT].createGain()

    decibelGain.connect(factorGain)

    super({ synth, inputs: [decibelGain], outputs: [factorGain] })

    this.decibels = new CurveSynthParam({
      node: this,
      unit: 'decibels',
      initialValue: Decibels(0),
      automate: { param: decibelGain.gain, map: decibels => 10 ** (decibels / 20) },
    })

    this.factor = new CurveSynthParam({
      node: this,
      unit: 'factor',
      initialValue: Factor(1),
      range: Range.positive,
      automate: { param: factorGain.gain },
    })
  }
}

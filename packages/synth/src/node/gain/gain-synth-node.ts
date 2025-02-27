import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { CurveSynthParam } from '#param'
import { Decibels, Factor } from '#units'
import { SYNTH_NODE_TYPE, SynthNode } from '../synth-node'

export class GainSynthNode extends SynthNode {
  readonly [SYNTH_NODE_TYPE] = 'gain'

  readonly decibels: CurveSynthParam<'decibels'>
  readonly factor: CurveSynthParam<'factor'>

  constructor(context: SynthContext) {
    const decibelGain = context[INTERNAL_AUDIO_CONTEXT].createGain()
    const factorGain = context[INTERNAL_AUDIO_CONTEXT].createGain()

    decibelGain.connect(factorGain)

    super({ context, inputs: [decibelGain], outputs: [factorGain] })

    this.decibels = new CurveSynthParam({
      node: this,
      unit: 'decibels',
      initialValue: Decibels.orThrow(0),
      automate: { param: decibelGain.gain, map: decibels => 10 ** (decibels / 20) },
    })

    this.factor = new CurveSynthParam({
      node: this,
      unit: 'factor',
      initialValue: Factor.orThrow(1),
      range: Range.positive,
      automate: { param: factorGain.gain },
    })
  }
}

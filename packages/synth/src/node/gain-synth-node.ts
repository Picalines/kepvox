import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { ScalarSynthParam } from '#param'
import { Decibels, Factor } from '#units'
import { SYNTH_NODE_TYPE, SynthNode } from './synth-node'

export class GainSynthNode extends SynthNode {
  readonly [SYNTH_NODE_TYPE] = 'gain'

  readonly decibels: ScalarSynthParam<'decibels'>
  readonly factor: ScalarSynthParam<'factor'>

  constructor(context: SynthContext) {
    const decibelGain = context[INTERNAL_AUDIO_CONTEXT].createGain()
    const factorGain = context[INTERNAL_AUDIO_CONTEXT].createGain()

    decibelGain.connect(factorGain)

    super({ context, inputs: [decibelGain], outputs: [factorGain] })

    this.decibels = new ScalarSynthParam({
      node: this,
      unit: 'decibels',
      initialValue: Decibels.orThrow(0),
      automate: { param: decibelGain.gain, map: decibels => 10 ** (decibels / 20) },
    })

    this.factor = new ScalarSynthParam({
      node: this,
      unit: 'factor',
      initialValue: Factor.orThrow(1),
      range: Range.positive,
      automate: { param: factorGain.gain },
    })
  }
}

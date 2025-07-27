import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { CurveSynthParam } from '#param'
import type { Synth } from '#synth'
import { Factor } from '#units'
import { SynthNode } from '../synth-node'

export class ConstantSynthNode extends SynthNode {
  readonly value: CurveSynthParam<'factor'>

  constructor(synth: Synth) {
    const constantSource = synth[INTERNAL_AUDIO_CONTEXT].createConstantSource()

    super({ synth, inputs: [], outputs: [constantSource] })

    this.value = new CurveSynthParam({
      node: this,
      unit: 'factor',
      initialValue: Factor(1),
      automate: { param: constantSource.offset },
    })

    constantSource.start()
  }
}

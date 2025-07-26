import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { CurveSynthParam } from '#param'
import { Factor } from '#units'
import { SynthNode } from '../synth-node'

export class ConstantSynthNode extends SynthNode {
  readonly value: CurveSynthParam<'factor'>

  constructor(context: SynthContext) {
    const constantSource = context[INTERNAL_AUDIO_CONTEXT].createConstantSource()

    super({ context, inputs: [], outputs: [constantSource] })

    this.value = new CurveSynthParam({
      node: this,
      unit: 'factor',
      initialValue: Factor(1),
      automate: { param: constantSource.offset },
    })

    constantSource.start()
  }
}

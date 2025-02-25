import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { ScalarSynthParam } from '#param'
import { Factor } from '#units'
import { SYNTH_NODE_TYPE, SynthNode } from '../synth-node'

export class ConstantSynthNode extends SynthNode {
  readonly [SYNTH_NODE_TYPE] = 'constant'

  readonly value: ScalarSynthParam<'factor'>

  constructor(context: SynthContext) {
    const constantSource = context[INTERNAL_AUDIO_CONTEXT].createConstantSource()

    super({ context, inputs: [], outputs: [constantSource] })

    this.value = new ScalarSynthParam({
      node: this,
      unit: 'factor',
      initialValue: Factor.orThrow(1),
      automate: { param: constantSource.offset },
    })

    constantSource.start()
  }
}

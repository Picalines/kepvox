import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { SynthNode, synthNodeType } from './synth-node'

export class OutputSynthNode extends SynthNode {
  readonly [synthNodeType] = 'output'

  /**
   * NOTE: you should get the instance from {@link SynthContext.output}
   */
  constructor(context: SynthContext) {
    const { destination } = context[INTERNAL_AUDIO_CONTEXT]

    super({ context, inputs: [destination], outputs: [] })
  }
}

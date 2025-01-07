import type { SynthContext } from '#context'
import { SynthNode, synthNodeType } from './synth-node'

export class OutputSynthNode extends SynthNode {
  readonly [synthNodeType] = 'output'

  private constructor(context: SynthContext) {
    const {
      audioContext: { destination },
    } = context

    super({ context, inputs: [destination], outputs: [] })
  }

  static readonly #contextOutputs = new WeakMap<SynthContext, OutputSynthNode>()

  static ofContext(context: SynthContext) {
    const output = OutputSynthNode.#contextOutputs.get(context) ?? new OutputSynthNode(context)

    if (!OutputSynthNode.#contextOutputs.has(context)) {
      OutputSynthNode.#contextOutputs.set(context, output)
    }

    return output
  }
}

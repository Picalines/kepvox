import { SynthNode } from '#node'

export const SYNTH_PARAM_TYPE: unique symbol = Symbol('SynthParam.type')

export type SynthParamOpts = {
  node: SynthNode
}

export abstract class SynthParam {
  abstract readonly [SYNTH_PARAM_TYPE]: string

  readonly node: SynthNode

  constructor(opts: SynthParamOpts) {
    const { node } = opts

    if (node.disposed.emitted) {
      throw new Error(`${SynthParam.name} can't be added to disposed ${SynthNode.name}`)
    }

    this.node = node
  }
}

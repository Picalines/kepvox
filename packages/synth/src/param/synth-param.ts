import { SynthNode } from '#node'

export const synthParamType: unique symbol = Symbol('SynthParam.type')

export type SynthParamOpts = {
  node: SynthNode
}

export abstract class SynthParam {
  abstract readonly [synthParamType]: string

  readonly node: SynthNode

  constructor(opts: SynthParamOpts) {
    const { node } = opts

    if (node.disposed.emitted) {
      throw new Error(`${SynthParam.name} can't be added to disposed ${SynthNode.name}`)
    }

    this.node = node
  }
}

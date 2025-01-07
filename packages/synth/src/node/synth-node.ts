import { assertDefined } from '@repo/common/assert'
import type { SynthContext } from '#context'

export const synthNodeType: unique symbol = Symbol('SynthNode.type')

export namespace SynthNode {
  export type Opts = {
    context: SynthContext

    /**
     * A SynthNode is a group of native AudioNodes. To manage
     * its connections, base SynthNode must receive the list of
     * inputs and outputs
     *
     * You can pass the same single AudioNode to both inputs & outputs,
     * if that's the only node you need. This mechanism is here to
     * allow for many AudioNodes inside one SynthNode and for cases
     * with no inputs or outputs
     */
    inputs: readonly AudioNode[]

    outputs: readonly AudioNode[]
  }
}

export abstract class SynthNode {
  abstract get [synthNodeType](): string

  readonly context: SynthContext

  #disposed = false

  readonly #inputs: readonly AudioNode[]
  readonly #outputs: readonly AudioNode[]

  // index corresponds to this node output, i.e. each
  // output has 0 or many connections to some node inputs
  readonly #connections: [node: SynthNode, input: number][][]

  constructor(opts: SynthNode.Opts) {
    const { context, inputs, outputs } = opts
    this.context = context

    this.#inputs = [...inputs]
    this.#outputs = [...outputs]

    this.#connections = outputs.map(() => [])
  }

  get disposed() {
    return this.#disposed
  }

  get numberOfInputs() {
    return this.#inputs.length
  }

  get numberOfOutputs() {
    return this.#outputs.length
  }

  connect(node: SynthNode, output = 0, input = 0): void {
    this.#assertNotDisposed()
    node.#assertNotDisposed()

    this.#assertOutputIndex(output)
    node.#assertInputIndex(input)

    const outputNode = this.#outputs[output]
    const inputNode = node.#inputs[input]
    const outputConnections = this.#connections[output]
    assertDefined(outputNode)
    assertDefined(inputNode)
    assertDefined(outputConnections)

    if (!outputConnections.some(c => c[0] === node && c[1] === input)) {
      outputConnections.push([node, input])
      outputNode.connect(inputNode)
    }
  }

  disconnect(node: SynthNode, output = 0, input = 0) {
    this.#assertNotDisposed()
    node.#assertNotDisposed()

    this.#assertOutputIndex(output)
    node.#assertInputIndex(input)

    const outputNode = this.#outputs[output]
    const inputNode = node.#inputs[input]
    const outputConnections = this.#connections[output]
    assertDefined(outputNode)
    assertDefined(inputNode)
    assertDefined(outputConnections)

    const connectionIndex = outputConnections.findIndex(c => c[0] === node && c[1] === input)
    if (connectionIndex >= 0) {
      outputConnections.splice(connectionIndex)
      outputNode.disconnect(inputNode)
    }
  }

  disconnectOutput(output: number) {
    this.#assertNotDisposed()
    this.#assertOutputIndex(output)

    const outputConnections = this.#connections[output]
    assertDefined(outputConnections)

    for (const [node, input] of [...outputConnections]) {
      this.disconnect(node, output, input)
    }
  }

  disconnectAll() {
    this.#assertNotDisposed()
    for (let output = 0; output < this.#outputs.length; output++) {
      this.disconnectOutput(output)
    }
  }

  /**
   * Stops any audio processing associated with the node
   * NOTE: must be idempotent
   * @virtual
   */
  dispose() {
    if (!this.#disposed) {
      this.disconnectAll()
    }

    this.#disposed = true
  }

  #assertNotDisposed() {
    if (this.#disposed) {
      throw new Error('SynthNode used after being disposed')
    }
  }

  #assertInputIndex(input: number) {
    if (input < 0 || input >= this.numberOfInputs) {
      throw new Error("the  SynthNode doesn't have enough inputs")
    }
  }

  #assertOutputIndex(output: number) {
    if (output < 0 || output >= this.numberOfOutputs) {
      throw new Error("the  SynthNode doesn't have enough outputs")
    }
  }
}

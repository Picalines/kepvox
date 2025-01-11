import { assertDefined } from '@repo/common/assert'
import type { SynthContext } from '#context'
import { SynthNodeSocket } from './synth-node-socket'

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

  readonly #inputs: readonly SynthNodeSocket[]
  readonly #outputs: readonly SynthNodeSocket[]

  constructor(opts: SynthNode.Opts) {
    const { context, inputs, outputs } = opts

    this.context = context

    this.#inputs = inputs.map(audioNode => new SynthNodeSocket(audioNode, 'input'))
    this.#outputs = outputs.map(audioNode => new SynthNodeSocket(audioNode, 'output'))
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

  connectOutput(node: SynthNode, output = 0, input = 0) {
    this.#assertNotDisposed()
    node.#assertNotDisposed()

    this.#assertOutputIndex(output)
    node.#assertInputIndex(input)

    const outputSocket = this.#outputs[output]
    const inputSocket = node.#inputs[input]
    assertDefined(outputSocket)
    assertDefined(inputSocket)

    outputSocket.connect(inputSocket)
  }

  disconnectOutput(node: SynthNode, output = 0, input: number | 'all' = 'all') {
    this.#assertNotDisposed()
    node.#assertNotDisposed()
    this.#assertOutputIndex(output)

    if (input === 'all') {
      for (let nodeInput = 0; nodeInput < node.numberOfInputs; nodeInput++) {
        this.disconnectOutput(node, output, input)
      }
      return
    }

    node.#assertInputIndex(input)

    const outputSocket = this.#outputs[output]
    const inputSocket = node.#inputs[input]
    assertDefined(outputSocket)
    assertDefined(inputSocket)

    outputSocket.disconnect(inputSocket)
  }

  disconnectAll() {
    this.#assertNotDisposed()

    for (const input of this.#inputs) {
      input.disconnectAll()
    }

    for (const output of this.#outputs) {
      output.disconnectAll()
    }
  }

  /**
   * Stops any audio processing associated with the node
   * NOTE: must be idempotent
   * @virtual
   */
  dispose() {
    if (this.#disposed) {
      return
    }

    this.#disposed = true

    for (const input of this.#inputs) {
      input.dispose()
    }

    for (const output of this.#outputs) {
      output.dispose()
    }
  }

  #assertNotDisposed() {
    if (this.#disposed) {
      throw new Error('SynthNode used after being disposed')
    }
  }

  #assertInputIndex(input: number) {
    if (input < 0 || input >= this.#inputs.length) {
      throw new Error("the  SynthNode doesn't have enough inputs")
    }
  }

  #assertOutputIndex(output: number) {
    if (output < 0 || output >= this.#outputs.length) {
      throw new Error("the  SynthNode doesn't have enough outputs")
    }
  }
}

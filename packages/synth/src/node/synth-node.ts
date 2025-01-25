import { assertDefined } from '@repo/common/assert'
import { type Disposable, DisposableStack } from '@repo/common/disposable'
import type { SynthContext } from '#context'
import { INTERNAL_CONTEXT_OWN } from '#internal-symbols'
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

export abstract class SynthNode implements Disposable {
  abstract get [synthNodeType](): string

  readonly context: SynthContext

  readonly #inputs: readonly SynthNodeSocket[]
  readonly #outputs: readonly SynthNodeSocket[]

  readonly #resources: DisposableStack

  constructor(opts: SynthNode.Opts) {
    const { context, inputs, outputs } = opts

    this.#inputs = inputs.map(audioNode => new SynthNodeSocket(audioNode, 'input'))
    this.#outputs = outputs.map(audioNode => new SynthNodeSocket(audioNode, 'output'))

    this.#resources = new DisposableStack([...this.#inputs, ...this.#outputs])

    this.context = context
    this.context[INTERNAL_CONTEXT_OWN](this)
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
   * @virtual
   */
  dispose() {
    this.#resources.dispose()
  }

  get disposed() {
    return this.#resources.disposed
  }

  #assertNotDisposed() {
    if (this.#resources.disposed.aborted) {
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

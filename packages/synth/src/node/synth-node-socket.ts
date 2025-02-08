import type { SynthNode } from './synth-node'

const hasAssociatedInputSocket: unique symbol = Symbol('hasAssociatedInputSocket')
const hasAssociatedOutputSocket: unique symbol = Symbol('hasAssociatedOutputSocket')

type SocketType = 'input' | 'output'

type Opts = {
  type: SocketType
  synthNode: SynthNode
  audioNode: AudioNode
}

/**
 * @internal
 */
export class SynthNodeSocket {
  readonly #type: SocketType

  readonly #synthNode: SynthNode
  readonly #audioNode: AudioNode

  readonly #connections: Set<SynthNodeSocket> = new Set()

  constructor(opts: Opts) {
    const { type, synthNode, audioNode } = opts

    if (type === 'input') {
      if (audioNode.numberOfInputs !== 1) {
        throw new Error('SynthNode allows only 1-input AudioNodes as its input')
      }

      if (hasAssociatedInputSocket in audioNode) {
        throw new Error('AudioNode already has an associated SynthNode input socket')
      }

      // @ts-expect-error
      audioNode[hasAssociatedInputSocket] = true
    }

    if (type === 'output') {
      if (audioNode.numberOfOutputs !== 1) {
        throw new Error('SynthNode allows only 1-output AudioNodes as its input')
      }

      if (hasAssociatedOutputSocket in audioNode) {
        throw new Error('AudioNode already has an associated SynthNode output socket')
      }

      // @ts-expect-error
      audioNode[hasAssociatedOutputSocket] = true
    }

    this.#type = type
    this.#synthNode = synthNode
    this.#audioNode = audioNode

    this.#synthNode.disposed.watch(() => this.disconnectAll())
  }

  connect(socket: SynthNodeSocket) {
    this.#assertNotDisposed()
    socket.#assertNotDisposed()
    this.#assertDifferentTypes(socket)

    if (this.#connections.has(socket)) {
      return
    }

    this.#connections.add(socket)
    socket.#connections.add(this)

    const [source, destination] =
      this.#type === 'output' ? [this.#audioNode, socket.#audioNode] : [socket.#audioNode, this.#audioNode]

    source.connect(destination)
  }

  disconnect(socket: SynthNodeSocket) {
    this.#assertNotDisposed()
    socket.#assertNotDisposed()
    this.#assertDifferentTypes(socket)

    if (!this.#connections.has(socket)) {
      return
    }

    this.#connections.delete(socket)
    socket.#connections.delete(this)

    const [source, destination] =
      this.#type === 'output' ? [this.#audioNode, socket.#audioNode] : [socket.#audioNode, this.#audioNode]

    source.disconnect(destination)
  }

  disconnectAll() {
    this.#assertNotDisposed()
    for (const socket of [...this.#connections]) {
      this.disconnect(socket)
    }
  }

  #assertNotDisposed() {
    if (this.#synthNode.disposed.emitted) {
      throw new Error('the SynthNode socket is already disposed')
    }
  }

  #assertDifferentTypes(otherSocket: SynthNodeSocket) {
    if (this.#type === otherSocket.#type) {
      throw new Error('Input-input and output-output connections are not allowed')
    }
  }
}

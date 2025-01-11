const hasAssociatedInputSocket: unique symbol = Symbol('hasAssociatedInputSocket')
const hasAssociatedOutputSocket: unique symbol = Symbol('hasAssociatedOutputSocket')

/**
 * @internal
 */
export class SynthNodeSocket {
  readonly #audioNode: AudioNode

  readonly #connections: Set<SynthNodeSocket> = new Set()

  #disposed = false

  constructor(
    audioNode: AudioNode,
    readonly type: 'input' | 'output',
  ) {
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

    this.#audioNode = audioNode
  }

  get disposed() {
    return this.#disposed
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
      this.type === 'output' ? [this.#audioNode, socket.#audioNode] : [socket.#audioNode, this.#audioNode]

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
      this.type === 'output' ? [this.#audioNode, socket.#audioNode] : [socket.#audioNode, this.#audioNode]

    source.disconnect(destination)
  }

  disconnectAll() {
    this.#assertNotDisposed()
    for (const socket of [...this.#connections]) {
      this.disconnect(socket)
    }
  }

  dispose() {
    if (this.#disposed) {
      return
    }

    this.disconnectAll()
    this.#disposed = true
  }

  #assertNotDisposed() {
    if (this.#disposed) {
      throw new Error('the SynthNode socket is already disposed')
    }
  }

  #assertDifferentTypes(otherSocket: SynthNodeSocket) {
    if (this.type === otherSocket.type) {
      throw new Error('Input-input and output-output connections are not allowed')
    }
  }
}

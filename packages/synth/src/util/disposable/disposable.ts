export type Disposable = {
  /**
   * Disposes the entity and all its dependencies.
   * Does nothing on the second call
   */
  dispose(): void

  /**
   * An AbortSignal that is emitted when the Disposable is disposed
   */
  readonly disposed: AbortSignal
}

export class DisposableStack implements Disposable {
  #disposed = false

  readonly #resources: Set<Disposable>

  readonly #disposedController = new AbortController()

  constructor(resources: Disposable[] = []) {
    this.#resources = new Set(resources)
  }

  /**
   * Adds the disposable to the stack.
   * NOTE: the dispose method will be called only once
   */
  add(resource: Disposable) {
    if (this.#disposed) {
      throw new Error('the DisposableStack is already disposed')
    }

    if (resource.disposed.aborted) {
      throw new Error('the Disposable argument is already disposed')
    }

    this.#resources.add(resource)

    resource.disposed.addEventListener('abort', () => this.#resources.delete(resource), { once: true })
  }

  dispose() {
    if (this.#disposed) {
      return
    }

    this.#disposed = true

    const disposables = [...this.#resources].toReversed()
    this.#resources.clear()

    for (const resource of disposables) {
      resource.dispose()
    }

    this.#disposedController.abort(DisposableStack.name)
  }

  get disposed() {
    return this.#disposedController.signal
  }
}

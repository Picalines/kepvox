export type EventMap = {
  readonly [event: string]: [...args: any[]]
}

export type ListenEmitter<EM extends EventMap> = Pick<Emitter<EM>, 'on' | 'off' | 'once'>

type OnOpts = {
  /**
   * An AbortSignal that will unsubscribe the callback when aborted.
   * NOTE: if the signal is already aborted, the subscription is ignored
   */
  signal?: AbortSignal
}

export class Emitter<EM extends EventMap> {
  readonly #listeners: Map<keyof EM, ((...args: any[]) => void)[]>

  constructor() {
    this.#listeners = new Map()
  }

  on<E extends keyof EM>(event: E, callback: (...args: EM[E]) => void, opts?: OnOpts) {
    const { signal } = opts ?? {}

    if (signal?.aborted) {
      return
    }

    const eventListeners = this.#listeners.get(event) ?? []

    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, eventListeners)
    }

    eventListeners.push(callback)

    signal?.addEventListener('abort', () => this.off(event, callback), { once: true })
  }

  off<E extends keyof EM>(event: E, callback: (...args: EM[E]) => void) {
    const eventListeners = this.#listeners.get(event)
    if (!eventListeners) {
      return
    }

    const callbackIndex = eventListeners.indexOf(callback)
    if (callbackIndex >= 0) {
      eventListeners.splice(callbackIndex, 1)
    }
  }

  /**
   * @returns a cancel function, because you can't use the callback
   */
  once<E extends keyof EM>(event: E, callback: (...args: EM[E]) => void) {
    const onceCallback = (...args: EM[E]) => {
      this.off(event, onceCallback)
      callback(...args)
    }

    this.on(event, onceCallback)

    return () => this.off(event, onceCallback)
  }

  emit<E extends keyof EM>(event: E, ...args: EM[E]) {
    const eventListeners = this.#listeners.get(event)
    if (!eventListeners) {
      return
    }

    for (const listener of eventListeners) {
      listener(...args)
    }
  }
}

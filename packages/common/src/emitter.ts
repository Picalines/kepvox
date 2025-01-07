export type EventMap = {
  readonly [event: string]: [...args: any[]]
}

export class Emitter<EM extends EventMap> {
  readonly #listeners: Map<keyof EM, ((...args: any[]) => void)[]>

  constructor() {
    this.#listeners = new Map()
  }

  on<E extends keyof EM>(event: E, callback: (...args: EM[E]) => void) {
    const eventListeners = this.#listeners.get(event) ?? []

    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, eventListeners)
    }

    eventListeners.push(callback)
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

  once<E extends keyof EM>(event: E, callback: (...args: EM[E]) => void) {
    const onceCallback = (...args: EM[E]) => {
      this.off(event, onceCallback)
      callback(...args)
    }

    return this.on(event, onceCallback)
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

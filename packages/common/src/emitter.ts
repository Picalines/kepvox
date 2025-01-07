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

  static listenMixin<EM extends EventMap>(Base: new (...args: any[]) => any = Object) {
    return class EmitterListenMixin extends Base implements Pick<Emitter<EM>, 'on' | 'off' | 'once'> {
      protected readonly _emit: Emitter<EM>['emit']
      readonly on: Emitter<EM>['on']
      readonly off: Emitter<EM>['off']
      readonly once: Emitter<EM>['once']

      constructor(...args: ConstructorParameters<typeof Base>) {
        super(...args)

        const emitter = new Emitter()

        this._emit = emitter.emit.bind(emitter)
        this.on = emitter.on.bind(emitter)
        this.off = emitter.off.bind(emitter)
        this.once = emitter.once.bind(emitter)
      }
    }
  }
}

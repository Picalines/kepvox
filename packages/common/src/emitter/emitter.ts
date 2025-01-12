export type EventMap = {
  readonly [event: string]: [...args: any[]]
}

export type ListenEmitter<EM extends EventMap> = Pick<Emitter<EM>, 'on' | 'off' | 'once'>

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

  static listenMixin<EM extends EventMap>() {
    return <T extends abstract new (...args: any[]) => any>(Base: T) => {
      abstract class EmitterListenMixin extends Base implements ListenEmitter<EM> {
        protected readonly _emit: Emitter<EM>['emit']
        readonly on: Emitter<EM>['on']
        readonly off: Emitter<EM>['off']
        readonly once: Emitter<EM>['once']

        constructor(...args: any) {
          super(...args)

          const emitter = new Emitter()

          this._emit = emitter.emit.bind(emitter)
          this.on = emitter.on.bind(emitter)
          this.off = emitter.off.bind(emitter)
          this.once = emitter.once.bind(emitter)
        }
      }

      return EmitterListenMixin
    }
  }
}

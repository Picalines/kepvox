type SignalOpts = {
  once?: boolean
  reverseOrder?: boolean
}

type SignalController<TParam> = Readonly<{
  signal: Signal<TParam>
  emit: (param: TParam) => void
  cancelAll: () => void
}>

export class Signal<TParam> {
  readonly #listeners: ((param: TParam) => void)[] = []

  readonly #once: boolean
  readonly #reverseOrder: boolean
  #emitted = false

  constructor(opts?: SignalOpts) {
    this.#once = opts?.once ?? false
    this.#reverseOrder = opts?.reverseOrder ?? false
  }

  static controlled<TParam>(opts?: SignalOpts): SignalController<TParam> {
    const signal = new Signal<TParam>(opts)
    return {
      signal,
      emit: signal.#emit.bind(signal),
      cancelAll: signal.#cancelAll.bind(signal),
    }
  }

  static combine<TParam>(signals: Signal<TParam>[]): Signal<TParam> {
    const { signal, emit } = Signal.controlled<TParam>()

    for (const parentSignal of signals) {
      parentSignal.watch(emit)
    }

    return signal
  }

  get emitted() {
    return this.#emitted
  }

  watch(listener: (param: TParam) => void) {
    if (this.#once && this.#emitted) {
      return
    }

    this.#listeners.push(listener)
  }

  watchUntil(cancelSignal: Signal<any>, listener: (param: TParam) => void) {
    if ((cancelSignal.#once && cancelSignal.#emitted) || (this.#once && this.#emitted)) {
      return
    }

    this.watch(listener)
    cancelSignal.watch(() => this.cancel(listener))
  }

  chain(signal: SignalController<TParam>) {
    this.watch(param => signal.emit(param))
  }

  cancel(listener: (param: TParam) => void) {
    const index = this.#listeners.indexOf(listener)
    if (index >= 0) {
      this.#listeners.splice(index, 1)
    }
  }

  #cancelAll() {
    this.#listeners.length = 0
  }

  #emit(param: TParam) {
    if (this.#once && this.#emitted) {
      return
    }

    this.#emitted = true

    if (this.#reverseOrder) {
      for (let index = this.#listeners.length - 1; index >= 0; index--) {
        this.#listeners[index]?.(param)
      }
    } else {
      for (const listener of this.#listeners) {
        listener(param)
      }
    }

    if (this.#once) {
      this.#cancelAll()
    }
  }
}

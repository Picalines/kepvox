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

  get emitted() {
    return this.#emitted
  }

  get watched() {
    return this.#listeners.length > 0
  }

  watch(listener: (param: TParam) => void) {
    if (this.#active) {
      this.#listeners.push(listener)
    }
  }

  cancel(listener: (param: TParam) => void) {
    const index = this.#listeners.indexOf(listener)
    if (index >= 0) {
      this.#listeners.splice(index, 1)
    }
  }

  watchUntil(cancelSignal: Signal<any>, listener: (param: TParam) => void) {
    if (!this.#active || !cancelSignal.#active) {
      return
    }

    const cancel = () => {
      this.cancel(listener)
      cancelSignal.cancel(cancel)
    }

    this.watch(listener)
    cancelSignal.watch(cancel)
  }

  toggle<TUndoParam>(
    undoSignal: Signal<TUndoParam>,
    applyListener: (param: TParam) => void,
    undoListener: (param: TUndoParam) => void,
  ) {
    if (!this.#active || !undoSignal.#active) {
      return
    }

    const apply = (param: TParam) => {
      this.cancel(apply)
      if (undoSignal.#active) {
        applyListener(param)
        undoSignal.watch(undo)
      }
    }

    const undo = (param: TUndoParam) => {
      undoSignal.cancel(undo)
      undoListener(param)
      if (this.#active) {
        this.watch(apply)
      }
    }

    this.watch(apply)
  }

  get #active() {
    return !(this.#once && this.#emitted)
  }

  #cancelAll() {
    this.#listeners.length = 0
  }

  #emit(param: TParam) {
    if (!this.#active) {
      return
    }

    this.#emitted = true

    const listeners = this.#reverseOrder ? this.#listeners.toReversed() : this.#listeners.slice()

    for (const listener of listeners) {
      listener(param)
    }

    if (this.#once) {
      this.#cancelAll()
    }
  }
}

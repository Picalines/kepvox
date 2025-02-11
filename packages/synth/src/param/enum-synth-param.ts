import type { SynthNode } from '#node'
import { Signal } from '#util/signal'
import { SYNTH_PARAM_TYPE, SynthParam } from './synth-param'

export type EnumSynthParamOpts<V extends string> = {
  node: SynthNode
  variants: readonly V[]
  initialValue: NoInfer<V>
}

export class EnumSynthParam<V extends string = string> extends SynthParam {
  readonly [SYNTH_PARAM_TYPE] = 'enum'

  readonly variants: readonly V[]

  #value?: V

  readonly #changed = Signal.controlled<V>()

  constructor(opts: EnumSynthParamOpts<V>) {
    const { node, variants, initialValue } = opts

    super({ node })

    if (!variants.length) {
      throw new Error('empty variants array is not allowed in an enum param')
    }

    this.variants = variants

    if (!variants.includes(initialValue)) {
      throw new Error('the initialValue argument is not a valid enum param variant')
    }

    this.value = initialValue

    node.disposed.watch(() => this.#changed.cancelAll())
  }

  get valueChanged() {
    return this.#changed.signal
  }

  get value(): V {
    if (this.#value === undefined) {
      throw new Error('getImmediate called before initialization')
    }

    return this.#value
  }

  set value(value: V) {
    if (!this.variants.includes(value)) {
      return
    }

    const oldValue = this.#value
    this.#value = value
    if (oldValue !== this.#value) {
      this.#changed.emit(value)
    }
  }
}

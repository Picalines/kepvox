import { Signal } from '#signal'
import { SYNTH_PARAM_TYPE, SynthParam, type SynthParamOpts } from './synth-param'

export type EnumSynthParamOpts<V extends string> = SynthParamOpts & {
  variants: readonly V[]
  initialValue: NoInfer<V>
}

export class EnumSynthParam<V extends string = string> extends SynthParam {
  readonly [SYNTH_PARAM_TYPE] = 'enum'

  readonly variants: readonly V[]

  #value: V

  readonly #changed = Signal.controlled<V>()

  constructor(opts: EnumSynthParamOpts<V>) {
    const { node, variants, initialValue } = opts

    super({ node })

    if (!variants.length) {
      throw new Error('empty variants array is not allowed in an enum param')
    }

    this.variants = [...variants]

    if (!this.variants.includes(initialValue)) {
      throw new Error('the initialValue argument is not a valid enum param variant')
    }

    this.#value = initialValue

    node.disposed.watch(() => this.#changed.cancelAll())
  }

  get changed() {
    return this.#changed.signal
  }

  get value(): V {
    return this.#value
  }

  set value(value: V) {
    if (!this.variants.includes(value) || this.#value === value) {
      return
    }

    this.#value = value
    this.#changed.emit(this.#value)
  }
}

import { Emitter } from '#util/emitter'
import { SynthParam, synthParamType } from './synth-param'

export type EnumSynthParamOpts<V extends string> = {
  variants: readonly V[]
  initialValue: NoInfer<V>
  synchronize?: (currentVariant: V) => void
}

type Events = {
  changed: []
}

export class EnumSynthParam<V extends string = string> extends SynthParam {
  readonly [synthParamType] = 'enum'

  readonly variants: readonly V[]

  #value?: V

  readonly #emitter = new Emitter<Events>()
  readonly on = this.#emitter.on.bind(this.#emitter)
  readonly off = this.#emitter.off.bind(this.#emitter)
  readonly once = this.#emitter.once.bind(this.#emitter)

  constructor({ variants, initialValue, synchronize }: EnumSynthParamOpts<V>) {
    super()

    if (!variants.length) {
      throw new Error('empty variants array is not allowed in an enum param')
    }

    this.variants = variants

    if (!variants.includes(initialValue)) {
      throw new Error('the initialValue argument is not a valid enum param variant')
    }

    if (synchronize) {
      this.on('changed', () => synchronize(this.value))
    }

    this.value = initialValue
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
      this.#emitter.emit('changed')
    }
  }
}

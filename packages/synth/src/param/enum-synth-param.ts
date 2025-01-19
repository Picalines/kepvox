import { Emitter } from '@repo/common/emitter'
import { SynthParam, synthParamType } from './synth-param'

export namespace EnumSynthParam {
  export type Opts<V extends string> = {
    variants: readonly V[]
    initialValue: NoInfer<V>
    synchronize?: (currentVariant: V) => void
  }
}

type Events = {
  changed: []
}

export class EnumSynthParam<V extends string = string> extends Emitter.listenMixin<Events>()(SynthParam) {
  readonly [synthParamType] = 'enum'

  readonly variants: readonly V[]

  #value?: V

  constructor({ variants, initialValue, synchronize }: EnumSynthParam.Opts<V>) {
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
      this._emit('changed')
    }
  }
}

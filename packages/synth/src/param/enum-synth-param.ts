import { type SynthParam, synthParamType } from './synth-param'

export namespace EnumSynthParam {
  export type Opts<V extends string> = {
    variants: readonly V[]
    initialValue: NoInfer<V>
  }
}

export class EnumSynthParam<V extends string = string> implements SynthParam {
  readonly [synthParamType] = 'enum'

  readonly variants: readonly V[]

  // @ts-expect-error: set by setValueImmediate
  #value: V

  constructor({ variants, initialValue }: EnumSynthParam.Opts<V>) {
    if (!variants.length) {
      throw new Error('empty variants array is not allowed in an enum param')
    }

    this.variants = variants

    if (!variants.includes(initialValue)) {
      throw new Error('the initialValue argument is not a valid enum param variant')
    }

    this.setValueImmediate(initialValue)
  }

  setValueImmediate(value: V) {
    if (this.variants.includes(value)) {
      this.#value = value
    }
  }

  getValueImmediate(): V {
    return this.#value
  }
}

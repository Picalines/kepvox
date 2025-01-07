import { type Range, clamp, isInRange, isRangeIncludes } from '@repo/common/math'
import { UNIT_RANGES, type UnitName } from '#units'
import { type SynthParam, synthParamType } from './synth-param'

export namespace ScalarSynthParam {
  export type Opts = {
    unit: UnitName
    initialValue: number
    range?: Range
  }
}

export class ScalarSynthParam implements SynthParam {
  readonly [synthParamType] = 'scalar'

  readonly unit: UnitName

  readonly range: Range

  // @ts-expect-error: set by setValueImmediate
  #value: number

  constructor({ unit, initialValue, range: rangeParam }: ScalarSynthParam.Opts) {
    this.unit = unit

    const unitRange = UNIT_RANGES[unit]
    if (rangeParam && !isRangeIncludes(unitRange, rangeParam)) {
      throw new Error(`the range parameter is larger than the ${unit} range`)
    }

    this.range = rangeParam ?? unitRange

    if (!isInRange(initialValue, this.range)) {
      throw new Error('the initialValue parameter is not in range')
    }

    this.setValueImmediate(initialValue)
  }

  setValueImmediate(value: number) {
    this.#value = clamp(value, this.range)
  }

  getValueImmediate() {
    return this.#value
  }
}

import { type Range, clamp, isInRange, isRangeIncludes } from '@repo/common/math'
import { UNIT_RANGES, type UnitName } from '#units'
import { SynthParam } from './synth-param'

type Opts = {
  name: string
  unit: UnitName
  initialValue: number
  range?: Range
}

export class SynthAudioParam extends SynthParam {
  readonly unit: UnitName

  readonly range: Range

  readonly #nativeParam: AudioParam

  constructor(nativeParam: AudioParam, { name, unit, initialValue, range: rangeParam }: Opts) {
    super(name)

    this.#nativeParam = nativeParam
    this.unit = unit

    const unitRange = UNIT_RANGES[unit]
    if (rangeParam && !isRangeIncludes(unitRange, rangeParam)) {
      throw new Error(`the range parameter is larger than the ${unit} range`)
    }

    this.range = rangeParam ?? unitRange

    const nativeRange: Range = [nativeParam.minValue, nativeParam.maxValue]
    if (!isRangeIncludes(nativeRange, this.range)) {
      throw new Error('the param range is larger the native range')
    }

    if (!isInRange(initialValue, this.range)) {
      throw new Error('the initialValue parameter is not in range')
    }

    this.setValueImmediate(initialValue)
  }

  setValueImmediate(value: number) {
    this.#nativeParam.value = clamp(value, this.range)
  }

  getValueImmediate() {
    return this.#nativeParam.value
  }
}

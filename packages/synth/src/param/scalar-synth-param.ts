import { Emitter } from '@repo/common/emitter'
import { type Range, clamp, isInRange, rangeIntersection } from '@repo/common/math'
import { UNIT_RANGES, type UnitName } from '#units'
import { type SynthParam, synthParamType } from './synth-param'

export namespace ScalarSynthParam {
  export type Opts = {
    unit: UnitName
    initialValue: number
    range?: Range
    synchronize?: (currentValue: number) => void
  }
}

type Events = {
  changed: []
}

export class ScalarSynthParam extends Emitter.listenMixin<Events>()(Object) implements SynthParam {
  readonly [synthParamType] = 'scalar'

  readonly unit: UnitName

  readonly range: Range

  #value?: number

  constructor({ unit, initialValue, range: rangeParam, synchronize }: ScalarSynthParam.Opts) {
    const unitRange = UNIT_RANGES[unit]
    const manualrange = rangeParam ?? [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]
    const paramRange = rangeIntersection(unitRange, manualrange)

    if (!paramRange) {
      throw new Error('the range parameter and the unit range have no values in common')
    }

    if (!isInRange(initialValue, paramRange)) {
      throw new Error('the initialValue parameter is not in range')
    }

    super()

    this.unit = unit
    this.range = paramRange

    if (synchronize) {
      this.on('changed', () => synchronize(this.getValueImmediate()))
    }

    this.setValueImmediate(initialValue)
  }

  setValueImmediate(value: number) {
    const oldValue = this.#value
    this.#value = clamp(value, this.range)
    if (oldValue !== this.#value) {
      this._emit('changed')
    }
  }

  getValueImmediate(): number {
    if (this.#value === undefined) {
      throw new Error('getValueImmediate called before initialization')
    }

    return this.#value
  }
}

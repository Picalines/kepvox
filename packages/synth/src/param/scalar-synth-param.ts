import { Emitter } from '@repo/common/emitter'
import { Range } from '@repo/common/math'
import { UNIT_RANGES, type UnitName } from '#units'
import { SynthParam, synthParamType } from './synth-param'

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

export class ScalarSynthParam extends Emitter.listenMixin<Events>()(SynthParam<number>) {
  readonly [synthParamType] = 'scalar'

  readonly unit: UnitName

  readonly range: Range

  #value?: number

  constructor({ unit, initialValue, range: rangeParam = Range.any, synchronize }: ScalarSynthParam.Opts) {
    const unitRange = UNIT_RANGES[unit]
    const paramRange = unitRange.intersection(rangeParam)

    if (!paramRange) {
      throw new Error('the range parameter and the unit range have no values in common')
    }

    if (!paramRange.includes(initialValue)) {
      throw new Error(`the initialValue ${initialValue} is not in range ${paramRange}`)
    }

    super()

    this.unit = unit
    this.range = paramRange

    if (synchronize) {
      this.on('changed', () => synchronize(this.getImmediate()))
    }

    this.setImmediate(initialValue)
  }

  setImmediate(value: number) {
    const oldValue = this.#value
    this.#value = this.range.clamp(value)
    if (oldValue !== this.#value) {
      this._emit('changed')
    }
  }

  getImmediate(): number {
    if (this.#value === undefined) {
      throw new Error('getValueImmediate called before initialization')
    }

    return this.#value
  }
}

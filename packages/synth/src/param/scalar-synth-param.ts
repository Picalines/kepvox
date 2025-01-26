import { Range } from '@repo/common/math'
import type { SynthContext } from '#context'
import { UNIT_RANGES, type UnitName } from '#units'
import { AutomationCurve } from './automation-curve'
import { SynthParam, synthParamType } from './synth-param'

export type ScalarSynthParamOpts = {
  context: SynthContext
  unit: UnitName
  initialValue: number
  range?: Range
}

export class ScalarSynthParam extends SynthParam {
  readonly [synthParamType] = 'scalar'

  readonly unit: UnitName
  readonly range: Range
  readonly curve: AutomationCurve

  readonly #context: SynthContext

  constructor(opts: ScalarSynthParamOpts) {
    const { context, unit, initialValue, range: rangeParam = Range.any } = opts

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

    this.#context = context
    this.curve = new AutomationCurve(context)

    this.curve.setValueAt(this.#context.firstBeat, initialValue)
  }

  get initialValue() {
    return this.curve.valueAt(this.#context.firstBeat)
  }

  set initialValue(value: number) {
    this.curve.setValueAt(this.#context.firstBeat, value)
  }
}

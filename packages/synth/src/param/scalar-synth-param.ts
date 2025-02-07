import type { SynthContext } from '#context'
import { Range } from '#math'
import { Unit, type UnitName, type UnitValue } from '#units'
import { AutomationCurve } from './automation-curve'
import { SynthParam, synthParamType } from './synth-param'

export type ScalarSynthParamOpts<TUnit extends UnitName> = {
  context: SynthContext
  unit: TUnit
  initialValue: UnitValue<TUnit>
  range?: Range
}

export class ScalarSynthParam<TUnit extends UnitName> extends SynthParam {
  readonly [synthParamType] = 'scalar'

  readonly unit: TUnit
  readonly range: Range
  readonly curve: AutomationCurve<TUnit>

  readonly #context: SynthContext

  constructor(opts: ScalarSynthParamOpts<TUnit>) {
    const { context, unit, initialValue, range: rangeParam = Range.any } = opts

    const unitRange = Unit[unit].range
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
    this.curve = new AutomationCurve(context, { initialValue })
  }

  get initialValue() {
    return this.curve.valueAt(this.#context.firstBeat)
  }

  set initialValue(value: UnitValue<TUnit>) {
    this.curve.setValueAt(this.#context.firstBeat, value)
  }
}

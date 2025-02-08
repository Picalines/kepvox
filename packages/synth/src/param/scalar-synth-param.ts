import { type SynthContext, SynthTime } from '#context'
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

  constructor(opts: ScalarSynthParamOpts<TUnit>) {
    const { unit, initialValue, range: rangeParam = Range.any } = opts

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

    this.curve = new AutomationCurve({ initialValue })
  }

  get initialValue() {
    return this.curve.valueAt(SynthTime.start)
  }

  set initialValue(value: UnitValue<TUnit>) {
    this.curve.setValueAt(SynthTime.start, value)
  }
}

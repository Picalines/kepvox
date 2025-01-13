import { Range } from '@repo/common/math'
import type { SynthContext, SynthTimeLike } from '#context'
import { UNIT_RANGES, type UnitName } from '#units'
import { AutomationCurve } from './automation-curve'
import { InterpolatedSynthParam, type InterpolationMethod, synthParamType } from './synth-param'

export namespace ScalarSynthParam {
  export type Opts = {
    context: SynthContext
    unit: UnitName
    initialValue: number
    range?: Range
  }
}

export class ScalarSynthParam extends InterpolatedSynthParam {
  readonly [synthParamType] = 'scalar'

  readonly unit: UnitName
  readonly range: Range

  readonly #context: SynthContext
  readonly #curve: AutomationCurve

  constructor(opts: ScalarSynthParam.Opts) {
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
    this.#curve = new AutomationCurve(context)

    this.#curve.setAt(0, initialValue)
  }

  setImmediate(value: number) {
    this.#curve.setAt(this.#context.currentTime, value)
  }

  getImmediate(): number {
    return this.#curve.getAt(this.#context.currentTime)
  }

  cancelAfter(time: SynthTimeLike) {
    return this.#curve.cancelAfter(time)
  }

  getAt(time: SynthTimeLike): number {
    return this.#curve.getAt(time)
  }

  setAt(time: SynthTimeLike, value: number) {
    return this.#curve.setAt(time, value)
  }

  holdAt(time: SynthTimeLike) {
    return this.#curve.holdAt(time)
  }

  rampUntil(end: SynthTimeLike, value: number, method?: InterpolationMethod) {
    return this.#curve.rampUntil(end, value, method)
  }
}

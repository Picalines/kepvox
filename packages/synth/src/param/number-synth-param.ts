import { Range } from '#math'
import { Signal } from '#signal'
import { Unit, type UnitName, type UnitValue } from '#units'
import { SYNTH_PARAM_TYPE, SynthParam, type SynthParamOpts } from './synth-param'

export type NumberSynthParamOpts<TUnit extends UnitName> = SynthParamOpts & {
  unit: TUnit
  initialValue: NoInfer<UnitValue<TUnit>>
  range?: Range
}

export class NumberSynthParam<TUnit extends UnitName> extends SynthParam {
  readonly [SYNTH_PARAM_TYPE] = 'number'

  readonly #unit: TUnit
  readonly #range: Range

  #value: UnitValue<TUnit>

  readonly #changed = Signal.controlled<UnitValue<TUnit>>()

  constructor(opts: NumberSynthParamOpts<TUnit>) {
    const { node, unit, initialValue, range: rangeOpt = Range.any } = opts

    const range = Unit[unit].range.intersection(rangeOpt)
    if (!range) {
      throw new Error(`${NumberSynthParam.name} with unit '${unit}' can't handle values in range ${rangeOpt}`)
    }

    super({ node })

    this.#unit = unit
    this.#range = range
    this.#value = Unit[unit].orThrow(this.#range.clamp(initialValue))

    node.disposed.watch(() => this.#changed.cancelAll())
  }

  get unit(): TUnit {
    return this.#unit
  }

  get range(): Range {
    return this.#range
  }

  get value(): UnitValue<TUnit> {
    return this.#value
  }

  get changed() {
    return this.#changed.signal
  }

  set value(value: UnitValue<TUnit>) {
    if (this.#value === value) {
      return
    }

    this.#value = Unit[this.#unit].orThrow(this.#range.clamp(value))
    this.#changed.emit(this.#value)
  }
}

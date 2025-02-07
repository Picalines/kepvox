import type { SynthContext } from '#context'
import { Range } from '#math'
import { Unit, type UnitName, type UnitValue } from '#units'
import { AudioAutomationCurve } from './audio-automation-curve'
import type { AutomationCurve } from './automation-curve'
import { SynthParam, synthParamType } from './synth-param'

export type AudioSynthParamOpts<TUnit extends UnitName> = {
  context: SynthContext
  unit: TUnit
  initialValue: UnitValue<TUnit>
  range?: Range
}

const hasAssociatedParamSymbol = Symbol('associatedSynthAudioParam')

export class AudioSynthParam<TUnit extends UnitName> extends SynthParam {
  readonly [synthParamType] = 'audio'

  readonly unit: TUnit
  readonly range: Range

  readonly #context: SynthContext
  readonly #audioParam: AudioParam
  readonly #curve: AudioAutomationCurve<TUnit>

  constructor(audioParam: AudioParam, opts: AudioSynthParamOpts<TUnit>) {
    const { context, unit, initialValue, range: rangeParam = Range.any } = opts

    const unitRange = Unit[unit].range
    const nativeRange = new Range(audioParam.minValue, audioParam.maxValue)
    const range = unitRange.intersection(nativeRange)?.intersection(rangeParam)

    if (!range) {
      throw new Error('the range parameter and AudioNode range have no point in common')
    }

    const safeInitialValue = range.clamp(initialValue)

    if (hasAssociatedParamSymbol in audioParam) {
      throw new Error('the AudioParam already has an AudioSynthParam associated with it')
    }

    super()

    // @ts-expect-error: adding a custom symbol to prevent "races"
    // between different synth parameters controlling the same AudioParam
    audioParam[hasAssociatedParamSymbol] = true

    this.unit = unit
    this.range = range

    this.#context = context
    this.#audioParam = audioParam
    this.#curve = new AudioAutomationCurve(context, this.#audioParam, {
      initialValue: safeInitialValue as UnitValue<TUnit>,
      valueRange: this.range,
    })

    this.#audioParam.cancelScheduledValues(0)
    this.#audioParam.setValueAtTime(safeInitialValue, 0)
  }

  get curve(): AutomationCurve<TUnit> {
    return this.#curve
  }

  get initialValue() {
    return this.curve.valueAt(this.#context.firstBeat)
  }

  set initialValue(value: UnitValue<TUnit>) {
    this.curve.setValueAt(this.#context.firstBeat, value)
  }
}

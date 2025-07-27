import { AutomationCurve, automateAudioParam } from '#automation'
import { Range } from '#math'
import { Time } from '#time'
import { Unit, type UnitName, type UnitValue } from '#units'
import { SYNTH_PARAM_TYPE, SynthParam, type SynthParamOpts } from './synth-param'

const synthAudioParams = new WeakSet<AudioParam>()

export type CurveSynthParamOpts<TUnit extends UnitName> = SynthParamOpts & {
  unit: TUnit
  initialValue: UnitValue<TUnit>
  range?: Range
  automate?: { param: AudioParam; map?: (value: UnitValue<TUnit>, time: Time) => number }
}

export class CurveSynthParam<TUnit extends UnitName> extends SynthParam {
  readonly [SYNTH_PARAM_TYPE] = 'curve'

  readonly curve: AutomationCurve<TUnit>

  constructor(opts: CurveSynthParamOpts<TUnit>) {
    const {
      node,
      automate: { param: audioParam, map: mapAudioParam } = {},
      unit,
      initialValue,
      range: rangeParam = Range.any,
    } = opts

    const { synth } = node

    if (audioParam && synthAudioParams.has(audioParam)) {
      throw new Error(`the ${AudioParam.name} already has an associated ${CurveSynthParam.name}`)
    }

    const unitRange = Unit[unit].range
    const audioRange = audioParam ? new Range(audioParam.minValue, audioParam.maxValue) : Range.any
    const valueRange = unitRange.intersection(audioRange)?.intersection(rangeParam)
    if (!valueRange) {
      throw new Error(`${AudioParam.name} with range ${audioRange} can't handle values in range ${valueRange}`)
    }

    const curve = new AutomationCurve({ unit, initialValue, valueRange })

    super({ node })

    this.curve = curve

    if (audioParam) {
      synthAudioParams.add(audioParam)

      automateAudioParam({
        synth,
        audioParam,
        curve,
        until: node.disposed,
        map: mapAudioParam,
      })
    }
  }

  get unit(): TUnit {
    return this.curve.unit
  }

  get range(): Range {
    return this.curve.valueRange
  }

  get initialValue() {
    return this.curve.valueAt(Time.start)
  }

  set initialValue(value: UnitValue<TUnit>) {
    this.curve.setValueAt(Time.start, value)
  }
}

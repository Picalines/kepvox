import { AutomationCurve, automateAudioParam } from '#automation'
import { Range } from '#math'
import type { SynthNode } from '#node'
import { SynthTime } from '#time'
import { Unit, type UnitName, type UnitValue } from '#units'
import { SYNTH_PARAM_TYPE, SynthParam } from './synth-param'

const synthAudioParams = new WeakSet<AudioParam>()

export type ScalarSynthParamOpts<TUnit extends UnitName> = {
  node: SynthNode
  unit: TUnit
  initialValue: UnitValue<TUnit>
  range?: Range
  automate?: { param: AudioParam; map?: (curveValue: UnitValue<TUnit>, time: SynthTime) => number }
}

export class ScalarSynthParam<TUnit extends UnitName> extends SynthParam {
  readonly [SYNTH_PARAM_TYPE] = 'scalar'

  readonly curve: AutomationCurve<TUnit>

  constructor(opts: ScalarSynthParamOpts<TUnit>) {
    const {
      node,
      automate: { param: audioParam, map: mapAudioParam } = {},
      unit,
      initialValue,
      range: rangeParam = Range.any,
    } = opts

    const { context } = node

    if (audioParam && synthAudioParams.has(audioParam)) {
      throw new Error(`the ${AudioParam.name} already has an associated ${ScalarSynthParam.name}`)
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
        context,
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
    return this.curve.valueAt(SynthTime.start)
  }

  set initialValue(value: UnitValue<TUnit>) {
    this.curve.setValueAt(SynthTime.start, value)
  }
}

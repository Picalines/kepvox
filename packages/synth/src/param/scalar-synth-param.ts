import { AutomationCurve } from '#automation'
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
  audioParam?: AudioParam
}

export class ScalarSynthParam<TUnit extends UnitName> extends SynthParam {
  readonly [SYNTH_PARAM_TYPE] = 'scalar'

  readonly curve: AutomationCurve<TUnit>

  readonly #audioParam: AudioParam | null

  constructor(opts: ScalarSynthParamOpts<TUnit>) {
    const { node, audioParam, unit, initialValue, range: rangeParam = Range.any } = opts
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
    this.#audioParam = audioParam ?? null

    if (audioParam) {
      synthAudioParams.add(audioParam)

      context.playing.watchUntil(node.disposed, ({ start }) => this.#scheduleAudio(start))
      context.stopped.watchUntil(node.disposed, () => this.#stopAudio())
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

  #scheduleAudio(start: SynthTime) {
    if (!this.#audioParam) {
      return
    }

    const curve = this.curve
    const audioParam = this.#audioParam
    const scheduleStart = this.context.scheduleTime
    const skippedSeconds = this.context.secondsPerNote.areaBefore(start)

    audioParam.setValueAtTime(curve.valueAt(start), 0)

    for (const event of curve.eventsAfter(start)) {
      const scheduleTime = scheduleStart + (this.context.secondsPerNote.areaBefore(event.time) - skippedSeconds)

      if (event.ramp) {
        const rampFunc =
          event.ramp.method === 'linear' ? audioParam.linearRampToValueAtTime : audioParam.exponentialRampToValueAtTime

        rampFunc.call(audioParam, event.ramp.value, scheduleTime - Number.EPSILON)
      }

      audioParam.setValueAtTime(event.value, scheduleTime)
    }
  }

  #stopAudio() {
    if (!this.#audioParam) {
      return
    }

    this.#audioParam.cancelScheduledValues(0)
    this.#audioParam.value = this.initialValue
  }
}

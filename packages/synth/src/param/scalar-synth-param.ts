import type { SynthContext } from '#context'
import { Range } from '#math'
import type { SynthNode } from '#node'
import { SynthTime } from '#time'
import { Unit, type UnitName, type UnitValue } from '#units'
import { AutomationCurve } from './automation-curve'
import { SynthParam, synthParamType } from './synth-param'

const hasAssociatedParam = Symbol('associatedSynthAudioParam')

export type ScalarSynthParamOpts<TUnit extends UnitName> = {
  node: SynthNode
  unit: TUnit
  initialValue: UnitValue<TUnit>
  range?: Range
  audioParam?: AudioParam
}

export class ScalarSynthParam<TUnit extends UnitName> extends SynthParam {
  readonly [synthParamType] = 'scalar'

  readonly unit: TUnit
  readonly range: Range
  readonly curve: AutomationCurve<TUnit>

  readonly #context: SynthContext
  readonly #audioParam: AudioParam | null

  constructor(opts: ScalarSynthParamOpts<TUnit>) {
    const { node, audioParam, unit, initialValue: initialValueParam, range: rangeParam = Range.any } = opts
    const { context } = node

    if (audioParam && hasAssociatedParam in audioParam) {
      throw new Error(`the ${AudioParam.name} already has an associated ${ScalarSynthParam.name}`)
    }

    const unitRange = Unit[unit].range
    const nativeRange = audioParam ? new Range(audioParam.minValue, audioParam.maxValue) : Range.any
    const range = unitRange.intersection(nativeRange)?.intersection(rangeParam)

    if (!range) {
      throw new Error('the ScalarSynthParam has invalid range')
    }

    const initialValue = Unit[unit].orClamp(range.clamp(initialValueParam))

    super({ node })

    this.unit = unit
    this.range = range
    this.curve = new AutomationCurve({ initialValue })

    this.#context = context
    this.#audioParam = audioParam ?? null

    if (audioParam) {
      // @ts-expect-error: adding a custom symbol to prevent "races"
      // between different synth parameters controlling the same AudioParam
      audioParam[hasAssociatedParam] = true

      context.playing.watchUntil(node.disposed, ({ start }) => this.#scheduleAudio(start))
      context.stopped.watchUntil(node.disposed, () => this.#stopAudio())
    }
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

    this.#audioParam.setValueAtTime(curve.valueAt(start), 0)

    const scheduleStart = this.#context.scheduleTime

    for (const event of curve.eventsAfter(start)) {
      const scheduleTime = scheduleStart + this.#context.secondsPerNote.areaBefore(event.time)

      const scheduleFunc = event.ramp
        ? event.ramp === 'linear'
          ? this.#audioParam.linearRampToValueAtTime
          : this.#audioParam.exponentialRampToValueAtTime
        : this.#audioParam.setValueAtTime

      scheduleFunc.call(this.#audioParam, event.value, scheduleTime)
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

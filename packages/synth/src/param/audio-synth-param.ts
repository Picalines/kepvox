import { type SynthContext, SynthTime } from '#context'
import { INTERNAL_CONTEXT_OWN } from '#internal-symbols'
import { Range } from '#math'
import { Unit, type UnitName, type UnitValue } from '#units'
import type { Disposable } from '#util/disposable'
import { AutomationCurve } from './automation-curve'
import { SynthParam, synthParamType } from './synth-param'

export type AudioSynthParamOpts<TUnit extends UnitName> = {
  context: SynthContext
  audioParam: AudioParam
  unit: TUnit
  initialValue: UnitValue<TUnit>
  range?: Range
}

const hasAssociatedParamSymbol = Symbol('associatedSynthAudioParam')

export class AudioSynthParam<TUnit extends UnitName> extends SynthParam implements Disposable {
  readonly [synthParamType] = 'audio'

  readonly unit: TUnit
  readonly range: Range

  readonly #context: SynthContext
  readonly #audioParam: AudioParam
  readonly #curve: AutomationCurve<TUnit>

  readonly #disposeController = new AbortController()

  constructor(opts: AudioSynthParamOpts<TUnit>) {
    const { context, audioParam, unit, initialValue: initialValueOpt, range: rangeParam = Range.any } = opts

    const unitRange = Unit[unit].range
    const nativeRange = new Range(audioParam.minValue, audioParam.maxValue)
    const range = unitRange.intersection(nativeRange)?.intersection(rangeParam)

    if (!range) {
      throw new Error('the range parameter and AudioNode range have no point in common')
    }

    const initialValue = Unit[unit].orClamp(range.clamp(initialValueOpt))

    if (hasAssociatedParamSymbol in audioParam) {
      throw new Error('the AudioParam already has an AudioSynthParam associated with it')
    }

    super()

    // @ts-expect-error: adding a custom symbol to prevent "races"
    // between different synth parameters controlling the same AudioParam
    audioParam[hasAssociatedParamSymbol] = true

    context[INTERNAL_CONTEXT_OWN](this)

    this.unit = unit
    this.range = range

    this.#context = context
    this.#audioParam = audioParam
    this.#curve = new AutomationCurve({ initialValue, valueRange: this.range })

    this.#context.on('play', this.#scheduleAudio.bind(this), { signal: this.disposed })
    this.#context.on('stop', this.#stopAudio.bind(this), { signal: this.disposed })

    this.#stopAudio()
  }

  get curve(): AutomationCurve<TUnit> {
    return this.#curve
  }

  get initialValue() {
    return this.curve.valueAt(SynthTime.start)
  }

  set initialValue(value: UnitValue<TUnit>) {
    this.curve.setValueAt(SynthTime.start, value)
  }

  get disposed() {
    return this.#disposeController.signal
  }

  dispose() {
    this.#disposeController.abort()
  }

  #scheduleAudio(start: SynthTime) {
    const curve = this.#curve

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
    this.#audioParam.cancelScheduledValues(0)
    this.#audioParam.value = this.initialValue
  }
}

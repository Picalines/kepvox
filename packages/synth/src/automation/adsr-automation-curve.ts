import { EnumAutomation, type ReadonlyEnumAutomation } from '#automation'
import { Time } from '#time'
import { Normal } from '#units'
import { AutomationCurve } from './automation-curve'
import type { ReadonlyAutomationCurve } from './readonly-automation-curve'

export type ADSRAutomationCurveOpts = {
  attack: ReadonlyAutomationCurve<'notes'>
  decay: ReadonlyAutomationCurve<'notes'>
  sustain: ReadonlyAutomationCurve<'normal'>
  release: ReadonlyAutomationCurve<'notes'>
}

const ADSR_CURVE_STATES = ['idle', 'attack', 'decay', 'sustain', 'release'] as const
type ADSRCurveState = (typeof ADSR_CURVE_STATES)[number]

export class ADSRAutomationCurve {
  readonly #state: EnumAutomation<ADSRCurveState>
  readonly #gain: AutomationCurve<'normal'>

  readonly #attack: ReadonlyAutomationCurve<'notes'>
  readonly #decay: ReadonlyAutomationCurve<'notes'>
  readonly #sustain: ReadonlyAutomationCurve<'normal'>
  readonly #release: ReadonlyAutomationCurve<'notes'>

  constructor(opts: ADSRAutomationCurveOpts) {
    const { attack, decay, sustain, release } = opts

    if (Math.min(attack.valueRange.min, decay.valueRange.min, release.valueRange.min) < 0) {
      throw new Error(`${ADSRAutomationCurve.name} doesn't support negative attack / decay / release durations`)
    }

    this.#state = new EnumAutomation({
      values: ADSR_CURVE_STATES,
      initialValue: 'idle',
    })

    this.#gain = new AutomationCurve({
      unit: 'normal',
      initialValue: Normal.min,
    })

    this.#attack = attack
    this.#decay = decay
    this.#sustain = sustain
    this.#release = release
  }

  get state(): ReadonlyEnumAutomation<ADSRCurveState> {
    return this.#state
  }

  get gain(): ReadonlyAutomationCurve<'normal'> {
    return this.#gain
  }

  /**
   * @returns time at which the sustain will start
   */
  attackAt(start: Time) {
    const attackDuration = this.#attack.valueAt(start)
    const attackEnd = start.add(Time.atNote(attackDuration))

    const decayDuration = this.#decay.valueAt(attackEnd)
    const decayEnd = attackEnd.add(Time.atNote(decayDuration))

    const sustainLevel = this.#sustain.valueAt(decayEnd)
    const attackValue = decayDuration > 0 ? Normal.max : sustainLevel

    this.#state.setValueAtUntil(start, decayEnd, 'attack')
    this.#state.setValueAt(attackEnd, 'decay')
    this.#state.setValueAt(decayEnd, 'sustain')

    this.#gain.setValueAtUntil(start, decayEnd, this.#gain.valueAt(start))
    this.#gain.rampValueAtTo(start, attackEnd, attackValue, 'linear')
    this.#gain.rampValueAtTo(attackEnd, decayEnd, sustainLevel)

    return decayEnd
  }

  /**
   * @returns time at which the release will end
   */
  releaseAt(start: Time) {
    if (this.#state.valueAt(start) === 'idle') {
      return start
    }

    const releaseDuration = this.#release.valueAt(start)
    const releaseEnd = start.add(Time.atNote(releaseDuration))

    this.#state.setValueAtUntil(start, releaseEnd, 'release')
    this.#state.setValueAt(releaseEnd, 'idle')

    this.#gain.setValueAtUntil(start, releaseEnd, this.#gain.valueAt(start))
    this.#gain.rampValueAtTo(start, releaseEnd, Normal.min)

    return releaseEnd
  }
}

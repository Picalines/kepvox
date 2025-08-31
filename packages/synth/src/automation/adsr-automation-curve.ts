import { EnumAutomation, type ReadonlyEnumAutomation } from '#automation'
import { Signal } from '#signal'
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

  readonly #stripAdded = Signal.controlled<{ attack: Time; release: Time }>()
  readonly #stripRemoved = Signal.controlled<{ attack: Time; release: Time }>()

  constructor(opts: ADSRAutomationCurveOpts) {
    const { attack, decay, sustain, release } = opts

    if (Math.min(attack.valueRange.min, decay.valueRange.min, release.valueRange.min) < 0) {
      throw new Error(`${ADSRAutomationCurve.name} doesn't support negative attack / decay / release durations`)
    }

    this.#state = new EnumAutomation({ values: ADSR_CURVE_STATES, initialValue: 'idle' })
    this.#gain = new AutomationCurve({ unit: 'normal', initialValue: Normal.min })

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

  get stripAdded() {
    return this.#stripAdded.signal
  }

  get stripRemoved() {
    return this.#stripRemoved.signal
  }

  triggerAtUntil(attack: Time, release: Time) {
    if (release.isBeforeOrAt(attack)) {
      return
    }

    const attackDuration = this.#attack.valueAt(attack)
    const attackEnd = attack.add(Time.atNote(attackDuration))

    const decayDuration = this.#decay.valueAt(attackEnd)
    const decayEnd = attackEnd.add(Time.atNote(decayDuration))

    const sustainLevel = this.#sustain.valueAt(decayEnd)
    const attackValue = decayDuration > 0 ? Normal.max : sustainLevel

    const releaseDuration = this.#release.valueAt(release)
    const releaseEnd = release.add(Time.atNote(releaseDuration))

    this.#state.setValueAtUntil(attack, releaseEnd, 'attack')
    this.#state.setValueAt(attackEnd, 'decay')
    this.#state.setValueAt(decayEnd, 'sustain')
    this.#state.setValueAt(release, 'release')
    this.#state.setValueAt(releaseEnd, 'idle')

    this.#gain.setValueAtUntil(attack, releaseEnd, this.#gain.valueAt(attack))
    this.#gain.rampValueAtTo(attack, attackEnd, attackValue, 'linear')
    this.#gain.rampValueAtTo(attackEnd, decayEnd, sustainLevel, 'linear')
    this.#gain.rampValueAtTo(release, releaseEnd, Normal.min, 'linear')
  }
}

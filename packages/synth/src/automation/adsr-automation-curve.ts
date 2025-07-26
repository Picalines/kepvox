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
   * @returns time at which the attack (more specifically, decay) will end
   */
  attackAt(start: Time) {
    const attackDuration = this.#attack.valueAt(start)
    const attackEnd = start.add(Time.atNote(attackDuration))

    const decayDuration = this.#decay.valueAt(attackEnd)
    const decayEnd = attackEnd.add(Time.atNote(decayDuration))

    const sustainLevel = this.#sustain.valueAt(decayEnd)
    const attackValue = decayDuration > 0 ? Normal.max : sustainLevel

    const gain = this.#gain
    const state = this.#state

    gain.holdValueAt(start)
    state.holdValueAt(start)

    state.setValueAt(start, 'attack')
    if (attackDuration > 0) {
      gain.rampValueUntil(attackEnd, attackValue, 'linear')
    } else {
      gain.setValueAt(attackEnd, attackValue)
    }

    state.setValueAt(attackEnd, 'decay')
    if (decayDuration > 0) {
      gain.rampValueUntil(decayEnd, sustainLevel, 'linear')
    } else {
      gain.setValueAt(decayEnd, sustainLevel)
    }

    state.setValueAt(decayEnd, 'sustain')

    return decayEnd
  }

  /**
   * @returns time at which the release will end
   */
  releaseAt(start: Time) {
    const releaseDuration = this.#release.valueAt(start)
    const releaseEnd = start.add(Time.atNote(releaseDuration))

    const gain = this.#gain
    const state = this.#state

    state.holdValueAt(start)
    gain.holdValueAt(start)

    if (state.valueAt(start) === 'idle') {
      return start
    }

    state.setValueAt(start, 'release')
    if (releaseDuration > 0) {
      gain.rampValueUntil(releaseEnd, Normal.min)
    } else {
      gain.setValueAt(releaseEnd, Normal.min)
    }

    state.setValueAt(releaseEnd, 'idle')

    return releaseEnd
  }

  muteAt(time: Time) {
    const gain = this.#gain
    const state = this.#state

    gain.holdValueAt(time)
    state.holdValueAt(time)

    gain.setValueAt(time, Normal.min)
    state.setValueAt(time, 'idle')
  }
}

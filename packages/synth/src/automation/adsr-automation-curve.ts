import { SynthTime } from '#time'
import { Normal } from '#units'
import { AutomationCurve } from './automation-curve'
import type { ReadonlyAutomationCurve } from './readonly-automation-curve'

export type ADSRAutomationCurveOpts = {
  attack: ReadonlyAutomationCurve<'notes'>
  decay: ReadonlyAutomationCurve<'notes'>
  sustain: ReadonlyAutomationCurve<'normal'>
  release: ReadonlyAutomationCurve<'notes'>
}

export class ADSRAutomationCurve {
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

    this.#gain = new AutomationCurve({
      unit: 'normal',
      initialValue: Normal.min,
    })

    this.#attack = attack
    this.#decay = decay
    this.#sustain = sustain
    this.#release = release
  }

  get gain(): ReadonlyAutomationCurve<'normal'> {
    return this.#gain
  }

  /**
   * @returns time at which the attack (more specifically, decay) will end
   */
  attackAt(start: SynthTime) {
    const attackDuration = this.#attack.valueAt(start)
    const attackEnd = start.add(SynthTime.fromNotes(attackDuration))

    const decayDuration = this.#decay.valueAt(attackEnd)
    const decayEnd = attackEnd.add(SynthTime.fromNotes(decayDuration))

    const sustainLevel = this.#sustain.valueAt(decayEnd)
    const attackValue = decayDuration > 0 ? Normal.max : sustainLevel

    const gain = this.#gain
    gain.holdValueAt(start)

    if (attackDuration > 0) {
      gain.rampValueUntil(attackEnd, attackValue, 'linear')
    } else {
      gain.setValueAt(attackEnd, attackValue)
    }

    if (decayDuration > 0) {
      gain.rampValueUntil(decayEnd, sustainLevel, 'linear')
    } else {
      gain.setValueAt(decayEnd, sustainLevel)
    }

    return decayEnd
  }

  /**
   * @returns time at which the release will end
   */
  releaseAt(start: SynthTime) {
    const releaseDuration = this.#release.valueAt(start)
    const releaseEnd = start.add(SynthTime.fromNotes(releaseDuration))

    const gain = this.#gain
    gain.holdValueAt(start)

    if (releaseDuration > 0) {
      gain.rampValueUntil(releaseEnd, Normal.min)
    } else {
      gain.setValueAt(releaseEnd, Normal.min)
    }

    return releaseEnd
  }
}

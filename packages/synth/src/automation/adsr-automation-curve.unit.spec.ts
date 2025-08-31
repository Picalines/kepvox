import { describe, expect, it, vi } from 'vitest'
import { ADSRAutomationCurve, AutomationCurve } from '#automation'
import { Range } from '#math'
import { Time } from '#time'
import { Normal, Notes } from '#units'

const createCurves = (attack: Notes, decay: Notes, sustain: Normal, release: Notes) => {
  return {
    attack: new AutomationCurve({ unit: 'notes', initialValue: attack, valueRange: Range.positive }),
    decay: new AutomationCurve({ unit: 'notes', initialValue: decay, valueRange: Range.positive }),
    sustain: new AutomationCurve({ unit: 'normal', initialValue: sustain }),
    release: new AutomationCurve({ unit: 'notes', initialValue: release, valueRange: Range.positive }),
  }
}

describe('ADSRAutomationCurve', () => {
  describe('triggerAtUntil', () => {
    it('sets gain value', () => {
      const curve = new ADSRAutomationCurve(createCurves(Notes(1), Notes(1), Normal(0.5), Notes(1)))

      curve.triggerAtUntil(Time.start, Time.n1.repeat(3))

      const values = Array.from(curve.gain.eventsAfterOrAt(Time.start))
      expect(values).toMatchObject([
        { time: Time.atNote(Notes(0.0)), value: Normal(0) },
        { time: Time.atNote(Notes(1.0)), value: Normal(1), ramp: {} },
        { time: Time.atNote(Notes(2.0)), value: Normal(0.5), ramp: {} },
        { time: Time.atNote(Notes(3.0)), value: Normal(0.5) },
        { time: Time.atNote(Notes(4.0)), value: Normal(0), ramp: {} },
      ])
    })

    it('sets gain value without decay', () => {
      const curve = new ADSRAutomationCurve(createCurves(Notes(1), Notes(0), Normal(0.5), Notes(1)))

      curve.triggerAtUntil(Time.start, Time.n1.repeat(3))

      const values = Array.from(curve.gain.eventsAfterOrAt(Time.start))
      expect(values).toMatchObject([
        { time: Time.atNote(Notes(0.0)), value: Normal(0) },
        { time: Time.atNote(Notes(1.0)), value: Normal(0.5), ramp: {} },
        { time: Time.atNote(Notes(3.0)), value: Normal(0.5) },
        { time: Time.atNote(Notes(4.0)), value: Normal(0), ramp: {} },
      ])
    })

    it('sets gain value without attack and decay', () => {
      const curve = new ADSRAutomationCurve(createCurves(Notes(0), Notes(0), Normal(0.5), Notes(1)))

      curve.triggerAtUntil(Time.start, Time.n1.repeat(3))

      const values = Array.from(curve.gain.eventsAfterOrAt(Time.start))
      expect(values).toMatchObject([
        { time: Time.atNote(Notes(0.0)), value: Normal(0.5) },
        { time: Time.atNote(Notes(3.0)), value: Normal(0.5) },
        { time: Time.atNote(Notes(4.0)), value: Normal(0), ramp: {} },
      ])
    })

    it('emits stripAdded', () => {
      const curve = new ADSRAutomationCurve(createCurves(Notes(1), Notes(1), Normal(0.5), Notes(1)))

      const stripAdded = vi.fn()
      curve.stripAdded.watch(stripAdded)
      curve.triggerAtUntil(Time.start, Time.n1)

      expect(stripAdded).toHaveBeenCalledWith({ attack: Time.start, release: Time.n1 })
    })

    it('does nothing if a strip exists in the time range', () => {
      const curve = new ADSRAutomationCurve(createCurves(Notes(0), Notes(0), Normal(1), Notes(0)))

      curve.triggerAtUntil(Time.n2, Time.n1)
      const stripRemoved = vi.fn()
      const stripAdded = vi.fn()
      curve.stripRemoved.watch(stripRemoved)
      curve.stripAdded.watch(stripAdded)

      curve.triggerAtUntil(Time.start, Time.n1)
      curve.triggerAtUntil(Time.start, Time.n1.repeat(2))
      curve.triggerAtUntil(Time.n2, Time.n1.repeat(2))

      expect(stripAdded).not.toHaveBeenCalled()
      expect(stripRemoved).not.toHaveBeenCalled()

      const states = Array.from(curve.state.eventsAfterOrAt(Time.start))
      expect(states).toMatchObject([
        { time: Time.start, value: 'idle' },
        { time: Time.n2, value: 'sustain' },
        { time: Time.n1, value: 'idle' },
      ])

      const values = Array.from(curve.gain.eventsAfterOrAt(Time.start))
      expect(values).toMatchObject([
        { time: Time.atNote(Notes(0.0)), value: Normal(0) },
        { time: Time.atNote(Notes(0.5)), value: Normal(1) },
        { time: Time.atNote(Notes(1.0)), value: Normal(0) },
      ])
    })

    it('adds a strip if called right after another one', () => {
      const curve = new ADSRAutomationCurve(createCurves(Notes(0), Notes(0), Normal(1), Notes(0)))

      curve.triggerAtUntil(Time.start, Time.n2)
      const stripRemoved = vi.fn()
      const stripAdded = vi.fn()
      curve.stripRemoved.watch(stripRemoved)
      curve.stripAdded.watch(stripAdded)

      curve.triggerAtUntil(Time.n2, Time.n1)

      expect(stripRemoved).not.toHaveBeenCalled()
      expect(stripAdded).toHaveBeenCalledWith({ attack: Time.n2, release: Time.n1 })

      const states = Array.from(curve.state.eventsAfterOrAt(Time.start))
      expect(states).toMatchObject([
        { time: Time.start, value: 'sustain' },
        { time: Time.n2, value: 'sustain' },
        { time: Time.n1, value: 'idle' },
      ])
    })

    it('adds a strip if called right before another one', () => {
      const curve = new ADSRAutomationCurve(createCurves(Notes(0), Notes(0), Normal(1), Notes(0)))

      curve.triggerAtUntil(Time.n2, Time.n1)
      const stripRemoved = vi.fn()
      const stripAdded = vi.fn()
      curve.stripRemoved.watch(stripRemoved)
      curve.stripAdded.watch(stripAdded)

      curve.triggerAtUntil(Time.start, Time.n2)

      expect(stripRemoved).not.toHaveBeenCalled()
      expect(stripAdded).toHaveBeenCalledWith({ attack: Time.start, release: Time.n2 })

      const states = Array.from(curve.state.eventsAfterOrAt(Time.start))
      expect(states).toMatchObject([
        { time: Time.start, value: 'sustain' },
        { time: Time.n2, value: 'sustain' },
        { time: Time.n1, value: 'idle' },
      ])
    })
  })
})

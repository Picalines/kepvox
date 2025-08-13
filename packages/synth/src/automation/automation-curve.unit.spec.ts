import { describe, expect, it, vi } from 'vitest'
import { Range } from '#math'
import { Time } from '#time'
import { Decibels, Factor, Normal, Unit } from '#units'
import { AutomationCurve } from './automation-curve'

describe('AutomationCurve', () => {
  describe('constructor', () => {
    it('should create an automation curve with initial value', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      expect(curve.unit).toBe('normal')
      expect(curve.valueRange).toEqual(Unit.normal.range)
      expect(curve.valueAt(Time.start)).toBe(0.5)
    })

    it('should accept custom value range', () => {
      const customRange = new Range(0.2, 0.8)
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
        valueRange: customRange,
      })

      expect(curve.valueRange).toEqual(customRange)
    })

    it('should throw error when unit range and value range do not intersect', () => {
      const incompatibleRange = new Range(2, 3) // normal unit range is [0, 1]

      expect(() => {
        new AutomationCurve({
          unit: 'normal',
          initialValue: Normal(0.5),
          valueRange: incompatibleRange,
        })
      }).toThrow()
    })
  })

  describe('setValueAt', () => {
    it('should set value at specific time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      curve.setValueAt(Time.n4, Normal(0.8))

      expect(curve.valueAt(Time.n4)).toBe(0.8)
      expect(curve.valueAt(Time.start)).toBe(0.5)
    })

    it('should retain value after time marker', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.2),
      })

      curve.setValueAt(Time.n4, Normal(0.8))

      expect(curve.valueAt(Time.n8)).toBe(0.2)
      expect(curve.valueAt(Time.n4)).toBe(0.8)
      expect(curve.valueAt(Time.n2)).toBe(0.8)
      expect(curve.valueAt(Time.n1)).toBe(0.8)
    })

    it('should override previous value at same time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      curve.setValueAt(Time.n4, Normal(0.3))
      curve.setValueAt(Time.n4, Normal(0.7))

      expect(curve.valueAt(Time.n4)).toBe(0.7)
    })

    it('should emit change events', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      const changeHandler = vi.fn()
      curve.changed.watch(changeHandler)

      curve.setValueAt(Time.n4, Normal(0.8))

      expect(changeHandler).toHaveBeenCalled()
    })
  })

  describe('rampValueUntil', () => {
    it('should create linear ramp by default', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueUntil(Time.n1, Normal(1.0))

      expect(curve.valueAt(Time.start)).toBe(0.0)
      expect(curve.valueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n1)).toBe(1.0)
    })

    it('should support exponential interpolation', () => {
      const curve = new AutomationCurve({
        unit: 'factor',
        initialValue: Factor(1.0),
      })

      curve.rampValueUntil(Time.n1, Factor(4.0), 'exponential')

      expect(curve.valueAt(Time.start)).toBe(1.0)
      expect(curve.valueAt(Time.n2)).toBe(2.0)
      expect(curve.valueAt(Time.n1)).toBe(4.0)
    })

    it('should preserve existing instant value at end time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.setValueAt(Time.n1, Normal(0.3))
      curve.rampValueUntil(Time.n1, Normal(1.0))

      expect(curve.valueAt(Time.n1)).toBe(0.3)
    })

    it('should override previous ramp parameters', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueUntil(Time.n1, Normal(0.5), 'linear')
      curve.rampValueUntil(Time.n1, Normal(1.0), 'exponential')

      expect(curve.valueAt(Time.n2)).not.toBe(0.25)
    })
  })

  describe('holdValueAt', () => {
    it('should freeze value at specified time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueUntil(Time.n1, Normal(1.0))
      curve.setValueAt(Time.n1.add(Time.n4), Normal(0.5))

      expect(curve.holdValueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n1)).toBe(0.5)
      expect(curve.eventAt(Time.n1.add(Time.n4))).toBeNull()
    })

    it('should return the held value', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.3),
      })

      expect(curve.holdValueAt(Time.n4)).toBe(0.3)
    })
  })

  describe('valueAt', () => {
    it('should return constant value when no interpolation', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.3),
      })

      curve.setValueAt(Time.n4, Normal(0.8))

      expect(curve.valueAt(Time.n8)).toBe(0.3)
      expect(curve.valueAt(Time.n4)).toBe(0.8)
      expect(curve.valueAt(Time.n2)).toBe(0.8)
    })

    it('should interpolate during linear ramp', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueUntil(Time.n1, Normal(1.0))

      expect(curve.valueAt(Time.start)).toBe(0.0)
      expect(curve.valueAt(Time.n4)).toBe(0.25)
      expect(curve.valueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n1.sub(Time.n4))).toBe(0.75)
    })

    it('should interpolate during exponential ramp', () => {
      const curve = new AutomationCurve({
        unit: 'factor',
        initialValue: Factor(1.0),
      })

      curve.rampValueUntil(Time.n1, Factor(4.0), 'exponential')

      expect(curve.valueAt(Time.start)).toBe(1.0)
      // biome-ignore lint/suspicious/noApproximativeNumericConstant:
      expect(curve.valueAt(Time.n4)).toBeCloseTo(1.414, 3)
      expect(curve.valueAt(Time.n2)).toBe(2.0)
      expect(curve.valueAt(Time.n1.sub(Time.n4))).toBeCloseTo(2.828, 3)
      expect(curve.valueAt(Time.n1)).toBe(4.0)
    })
  })

  describe('areaBefore', () => {
    it('should calculate area under constant curve', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      expect(curve.areaBefore(Time.n1)).toBe(0.5 * 1) // value * time
    })

    it('should calculate area under linear ramp', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueUntil(Time.n1, Normal(1.0))

      expect(curve.areaBefore(Time.n1)).toBe(0.5) // triangle area: (0 + 1) / 2 * 1
    })

    it('should calculate area under exponential ramp', () => {
      const curve = new AutomationCurve({
        unit: 'factor',
        initialValue: Factor(1.0),
      })

      curve.rampValueUntil(Time.n1, Factor(4.0), 'exponential')
      expect(curve.areaBefore(Time.n1)).toBeCloseTo(2.164, 3)
    })

    it('should throw error when called before curve start', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      expect(() => {
        curve.areaBefore(Time.start.sub(Time.n4))
      }).toThrow()
    })

    it('should accumulate areas across multiple segments', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      curve.setValueAt(Time.n2, Normal(1.0))
      curve.setValueAt(Time.n1, Normal(0.0))

      const area = curve.areaBefore(Time.n1)

      expect(area).toBe(0.75)
    })
  })

  describe('event timeline methods', () => {
    it('should find event at specific time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.2),
      })

      curve.setValueAt(Time.n4, Normal(0.5))
      curve.setValueAt(Time.n2, Normal(0.8))
      curve.setValueAt(Time.n1, Normal(0.3))

      const event = curve.eventAt(Time.n2)
      expect(event?.value).toBe(0.8)
    })

    it('should find event before time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.2),
      })

      curve.setValueAt(Time.n4, Normal(0.5))
      curve.setValueAt(Time.n2, Normal(0.8))
      curve.setValueAt(Time.n1, Normal(0.3))

      const event = curve.eventBefore(Time.n2.add(Time.n8))
      expect(event?.time).toEqual(Time.n2)
    })

    it('should find event before or at time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.2),
      })

      curve.setValueAt(Time.n4, Normal(0.5))
      curve.setValueAt(Time.n2, Normal(0.8))
      curve.setValueAt(Time.n1, Normal(0.3))

      const event = curve.eventBeforeOrAt(Time.n2)
      expect(event?.time).toEqual(Time.n2)
    })

    it('should find event after time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.2),
      })

      curve.setValueAt(Time.n4, Normal(0.5))
      curve.setValueAt(Time.n2, Normal(0.8))
      curve.setValueAt(Time.n1, Normal(0.3))

      const event = curve.eventAfter(Time.n4)
      expect(event?.time).toEqual(Time.n2)
    })

    it('should find events in range', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.2),
      })

      curve.setValueAt(Time.n4, Normal(0.5))
      curve.setValueAt(Time.n2, Normal(0.8))
      curve.setValueAt(Time.n1, Normal(0.3))

      const events = Array.from(curve.eventsInRange(Time.n8, Time.n2.add(Time.n8)))

      expect(events).toHaveLength(2) // n4 and n2 events
      expect(events[0]?.time).toEqual(Time.n4)
      expect(events[1]?.time).toEqual(Time.n2)
    })

    it('should find event span around time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.2),
      })

      curve.setValueAt(Time.n4, Normal(0.5))
      curve.setValueAt(Time.n2, Normal(0.8))
      curve.setValueAt(Time.n1, Normal(0.3))

      const [before, after] = curve.eventSpan(Time.n4.add(Time.n8))

      expect(before?.time).toEqual(Time.n4)
      expect(after?.time).toEqual(Time.n2)
    })
  })

  describe('properties', () => {
    it('should expose unit property', () => {
      const curve = new AutomationCurve({
        unit: 'decibels',
        initialValue: Decibels(-6),
      })

      expect(curve.unit).toBe('decibels')
    })

    it('should expose valueRange property', () => {
      const customRange = new Range(0.1, 0.9)
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
        valueRange: customRange,
      })

      expect(curve.valueRange).toEqual(customRange)
    })

    it('should expose timeRange property', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.5),
      })

      curve.setValueAt(Time.n1, Normal(0.8))

      const [start, end] = curve.timeRange
      expect(start).toEqual(Time.start)
      expect(end).toEqual(Time.n1)
    })
  })
})

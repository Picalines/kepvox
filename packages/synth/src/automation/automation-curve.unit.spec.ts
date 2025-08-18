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
        initialValue: Normal(0),
      })

      curve.setValueAt(Time.n2, Normal(1))

      expect(curve.valueAt(Time.start)).toBe(0)
      expect(curve.valueAt(Time.n4)).toBe(0)
      expect(curve.valueAt(Time.n2)).toBe(1)
      expect(curve.valueAt(Time.n1)).toBe(1)
    })

    it('should override previous value at same time', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.setValueAt(Time.n1, Normal(0.25))
      curve.setValueAt(Time.n1, Normal(0.5))

      expect(curve.valueAt(Time.n1)).toBe(0.5)
    })

    it('should emit the changed signal', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      const onChanged = vi.fn()
      curve.changed.watch(onChanged)
      curve.setValueAt(Time.n4, Normal(0.5))

      expect(onChanged).toHaveBeenCalledWith({ time: Time.n4, value: Normal(0.5) })
    })

    it('should keep the next event', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.setValueAt(Time.n1, Normal(1))
      curve.setValueAt(Time.n2, Normal(0.5))

      expect(curve.valueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n2.add(Time.n4))).toBe(0.5)
      expect(curve.valueAt(Time.n1)).toBe(1)
    })

    it('should cancel a ramp at its start', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Normal(1))
      curve.setValueAt(Time.start, Normal(0))

      expect(curve.valueAt(Time.n2)).toBe(0)
    })

    it('should stop a ramp between events', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Normal(1), 'linear')
      curve.setValueAt(Time.n2, Normal(0.75))

      expect(curve.valueAt(Time.n4)).toBe(0.25)
      expect(curve.valueAt(Time.n2)).toBe(0.75)
      expect(curve.valueAt(Time.n2.add(Time.n4))).toBe(0.75)
      expect(curve.valueAt(Time.n1)).toBe(0)
    })
  })

  describe('setValueAtUntil', () => {
    it('should set the value inside a range', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.setValueAtUntil(Time.n4, Time.n1.sub(Time.n4), Normal(1))

      expect(curve.valueAt(Time.start)).toBe(0)
      expect(curve.valueAt(Time.n2)).toBe(1)
      expect(curve.valueAt(Time.n1)).toBe(0)
    })

    it('should keep ramps around range edges', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.rampValueAtTo(Time.start, Time.n2, Normal(1), 'linear')
      curve.rampValueAtUntil(Time.n2, Time.n1, Normal(0), 'linear')
      curve.setValueAtUntil(Time.n4, Time.n1.sub(Time.n4), Normal(0.33))

      expect(curve.valueAt(Time.n8)).toBe(0.25)
      expect(curve.valueAt(Time.n4)).toBe(0.33)
      expect(curve.valueAt(Time.n1.sub(Time.n8))).toBe(0.25)
    })

    it('should keep an outer ramp', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.rampValueAtTo(Time.start, Time.n1, Normal(1), 'linear')
      curve.setValueAtUntil(Time.n4, Time.n1.sub(Time.n4), Normal(0.333))

      expect(curve.valueAt(Time.n8)).toBe(0.125)
      expect(curve.valueAt(Time.n4)).toBe(0.333)
      expect(curve.valueAt(Time.n1.sub(Time.n4))).toBe(0.75)
      expect(curve.valueAt(Time.n1)).toBe(1)
    })
  })

  describe('rampValueAtUntil', () => {
    it('should create linear ramp by default', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Normal(1.0))

      expect(curve.valueAt(Time.start)).toBe(0.0)
      expect(curve.valueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n2.add(Time.n4))).toBe(0.75)
    })

    it('should support exponential interpolation', () => {
      const curve = new AutomationCurve({
        unit: 'factor',
        initialValue: Factor(1.0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Factor(4.0), 'exponential')

      expect(curve.valueAt(Time.start)).toBe(1.0)
      expect(curve.valueAt(Time.n2)).toBe(2.0)
    })

    it('should not override existing curve value at end', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.setValueAt(Time.n1, Normal(1))
      curve.rampValueAtUntil(Time.start, Time.n1, Normal(0.5))

      expect(curve.valueAt(Time.n2)).toBe(0.25)
      expect(curve.valueAt(Time.n1)).toBe(1)
    })

    it('should override previous ramp parameters', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Normal(0.5), 'linear')
      curve.rampValueAtUntil(Time.start, Time.n1, Normal(1.0), 'exponential')

      expect(curve.valueAt(Time.n2)).not.toBe(0.25)
    })

    it('emits a changed signal when the ramp is added', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      const onChanged = vi.fn()
      curve.changed.watch(onChanged)
      curve.rampValueAtUntil(Time.start, Time.n1, Normal(1))

      expect(onChanged).toHaveBeenCalledWith({
        time: Time.n1,
        value: Normal(0),
        ramp: { value: Normal(1), method: 'linear' },
      })
    })

    it('should not change curve if called with same time arguments', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      const onChanged = vi.fn()
      curve.changed.watch(onChanged)
      curve.rampValueAtUntil(Time.n2, Time.n2, Normal(1))

      expect(onChanged).not.toHaveBeenCalled()
    })
  })

  describe('rampValueAtTo', () => {
    it('should override the curve value after a ramp end', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueAtTo(Time.start, Time.n1, Normal(1))

      expect(curve.valueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n1)).toBe(1)
    })

    it('should set value if called with same time arguments', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.rampValueAtTo(Time.n2, Time.n2, Normal(1))

      expect(curve.valueAt(Time.start)).toBe(0)
      expect(curve.valueAt(Time.n2)).toBe(1)
      expect(curve.valueAt(Time.n1)).toBe(1)
    })
  })

  describe('valueAt', () => {
    it('should return constant value when no interpolation', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0),
      })

      curve.setValueAt(Time.n4, Normal(1))

      expect(curve.valueAt(Time.n8)).toBe(0)
      expect(curve.valueAt(Time.n4)).toBe(1)
      expect(curve.valueAt(Time.n2)).toBe(1)
    })

    it('should interpolate during linear ramp', () => {
      const curve = new AutomationCurve({
        unit: 'normal',
        initialValue: Normal(0.0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Normal(1.0))

      expect(curve.valueAt(Time.start)).toBe(0.0)
      expect(curve.valueAt(Time.n4)).toBe(0.25)
      expect(curve.valueAt(Time.n2)).toBe(0.5)
      expect(curve.valueAt(Time.n2.add(Time.n4))).toBe(0.75)
    })

    it('should interpolate during exponential ramp', () => {
      const curve = new AutomationCurve({
        unit: 'factor',
        initialValue: Factor(1.0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Factor(4.0), 'exponential')

      expect(curve.valueAt(Time.start)).toBe(1.0)
      // biome-ignore lint/suspicious/noApproximativeNumericConstant:
      expect(curve.valueAt(Time.n4)).toBeCloseTo(1.414, 3)
      expect(curve.valueAt(Time.n2)).toBe(2.0)
      expect(curve.valueAt(Time.n2.add(Time.n4))).toBeCloseTo(2.828, 3)
    })

    it('should interpolate a value before the first event', () => {
      const curve = new AutomationCurve({
        unit: 'factor',
        initialValue: Factor(1),
      })

      expect(curve.valueAt(Time.n1.repeat(-1))).toBe(1)
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

      curve.rampValueAtUntil(Time.start, Time.n1, Normal(1.0))

      expect(curve.areaBefore(Time.n1)).toBe(0.5) // triangle area: (0 + 1) / 2 * 1
    })

    it('should calculate area under exponential ramp', () => {
      const curve = new AutomationCurve({
        unit: 'factor',
        initialValue: Factor(1.0),
      })

      curve.rampValueAtUntil(Time.start, Time.n1, Factor(4.0), 'exponential')
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

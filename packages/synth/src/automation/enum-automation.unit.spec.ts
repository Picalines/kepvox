import { describe, expect, it } from 'vitest'
import { Time } from '#time'
import { EnumAutomation } from './enum-automation'

describe('EnumAutomation', () => {
  describe('constructor', () => {
    it('should initialize with values and initial value', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      expect(automation.values).toEqual(['sin', 'cos', 'saw'])
      expect(automation.valueAt(Time.start)).toBe('sin')
    })

    it('should create a copy of values array', () => {
      const values = ['sin', 'cos', 'saw']
      const automation = new EnumAutomation({
        values,
        initialValue: 'sin',
      })

      values.push('triangle') // Modify original array
      expect(automation.values).toStrictEqual(['sin', 'cos', 'saw'])
    })
  })

  describe('setValueAt', () => {
    it('should set value at specific time', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n2, 'cos')
      automation.setValueAt(Time.n1, 'saw')

      expect(automation.valueAt(Time.start)).toBe('sin')
      expect(automation.valueAt(Time.n2)).toBe('cos')
      expect(automation.valueAt(Time.n1)).toBe('saw')
    })

    it('should overwrite existing value at same time', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n2, 'cos')
      automation.setValueAt(Time.n2, 'saw')

      expect(automation.valueAt(Time.n2)).toBe('saw')
    })
  })

  describe('holdValueAt', () => {
    it('should hold current value at specified time', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n2, 'cos')
      const heldValue = automation.holdValueAt(Time.n4)

      expect(heldValue).toBe('sin')
      expect(automation.valueAt(Time.n4)).toBe('sin')
    })

    it('should return and set the held value', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n4, 'cos')
      const heldValue = automation.holdValueAt(Time.n2)

      expect(heldValue).toBe('cos')
      expect(automation.valueAt(Time.n2)).toBe('cos')
    })
  })

  describe('valueAt', () => {
    it('should return initial value before first event', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n2, 'cos')

      expect(automation.valueAt(Time.n4)).toBe('sin')
      expect(automation.valueAt(Time.n8)).toBe('sin')
    })

    it('should return exact value at event time', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n2, 'cos')
      automation.setValueAt(Time.n1, 'saw')

      expect(automation.valueAt(Time.n2)).toBe('cos')
      expect(automation.valueAt(Time.n1)).toBe('saw')
    })

    it('should return last value after last event', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n2, 'cos')
      automation.setValueAt(Time.n1, 'saw')

      expect(automation.valueAt(Time.n1.add(Time.n1))).toBe('saw')
    })

    it('should return value from last event before queried time', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n4, 'cos')
      automation.setValueAt(Time.n2, 'saw')

      // Between n4 and n2
      expect(automation.valueAt(Time.n4.add(Time.n8))).toBe('cos')
    })
  })

  describe('properties', () => {
    it('should expose values property', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      expect(automation.values).toStrictEqual(['sin', 'cos', 'saw'])
    })

    it('should expose timeRange property', () => {
      const automation = new EnumAutomation({
        values: ['sin', 'cos', 'saw'] as const,
        initialValue: 'sin',
      })

      automation.setValueAt(Time.n2, 'cos')
      automation.setValueAt(Time.n1, 'saw')

      const [start, end] = automation.timeRange
      expect(start).toEqual(Time.start)
      expect(end).toEqual(Time.n1)
    })
  })
})

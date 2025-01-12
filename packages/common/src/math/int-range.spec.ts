import { describe, expect, it } from 'vitest'
import { IntRange } from './int-range'

describe('constructor', () => {
  it('throws on min > max', () => {
    expect(() => new IntRange(10, 5)).toThrow()
  })

  it('throws on NaN', () => {
    expect(() => new IntRange(Number.NaN, 0)).toThrow()
    expect(() => new IntRange(0, Number.NaN)).toThrow()
    expect(() => new IntRange(Number.NaN, Number.NaN)).toThrow()
  })

  it('allows infinity', () => {
    expect(() => new IntRange(0, Number.POSITIVE_INFINITY)).not.toThrow()
    expect(() => new IntRange(Number.NEGATIVE_INFINITY, 0)).not.toThrow()
    expect(() => new IntRange(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)).not.toThrow()
  })

  it('allows min = max', () => {
    expect(() => new IntRange(10, 10)).not.toThrow()
  })
})

describe('includes', () => {
  it('is inclusive', () => {
    const range = new IntRange(0, 1)
    expect(range.includes(0)).toEqual(true)
    expect(range.includes(1)).toEqual(true)
  })

  it('throws on NaN', () => {
    const range = new IntRange(0, 0)
    expect(() => range.includes(Number.NaN)).toThrow()
  })

  it('returns false for floats', () => {
    const range = new IntRange(0, 10)
    expect(range.includes(5.5)).toEqual(false)
  })
})

describe('contains', () => {
  it('is inclusive', () => {
    expect(new IntRange(0, 10).contains(new IntRange(0, 5))).toEqual(true)
    expect(new IntRange(0, 10).contains(new IntRange(5, 10))).toEqual(true)
  })

  it('returns false on bigger range', () => {
    expect(new IntRange(0, 10).contains(new IntRange(-10, 10))).toEqual(false)
  })

  it('handles infinity', () => {
    expect(new IntRange(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY).contains(new IntRange(0, 1))).toEqual(true)
  })
})

describe('intersection', () => {
  it('returns the smaller inner range', () => {
    expect(new IntRange(0, 10).intersection(new IntRange(2, 5))).toEqual(new IntRange(2, 5))
    expect(new IntRange(1, 3).intersection(new IntRange(-20, 20))).toEqual(new IntRange(1, 3))
  })

  it('handles infinity', () => {
    expect(IntRange.any.intersection(new IntRange(0, 1))).toEqual(new IntRange(0, 1))
    expect(IntRange.negative.intersection(IntRange.positive)).toEqual(new IntRange(0, 0))
  })
})

describe('clamp', () => {
  it('returns min if the value is less than min', () => {
    expect(IntRange.positive.clamp(-1)).toEqual(0)
  })

  it('returns max if the value is greater than max', () => {
    expect(new IntRange(-5, 1).clamp(2)).toEqual(1)
  })

  it('returns the value if it lies in the range', () => {
    const range = new IntRange(1, 3)
    expect(range.clamp(1)).toEqual(1)
    expect(range.clamp(2)).toEqual(2)
    expect(range.clamp(3)).toEqual(3)
  })

  it("rounds the value if it's float", () => {
    const range = new IntRange(0, 10)
    expect(range.clamp(5.1, 'ceil')).toEqual(6)
    expect(range.clamp(5.6, 'ceil')).toEqual(6)
    expect(range.clamp(5.2, 'floor')).toEqual(5)
    expect(range.clamp(5.7, 'floor')).toEqual(5)
    expect(range.clamp(5.8, 'round')).toEqual(6)
    expect(range.clamp(5.5, 'round')).toEqual(6)
  })

  it('allows Infinity', () => {
    expect(IntRange.positive.clamp(-100)).toEqual(0)
    expect(IntRange.negative.clamp(100)).toEqual(0)
    expect(IntRange.any.clamp(123)).toEqual(123)
    expect(IntRange.any.clamp(Number.POSITIVE_INFINITY)).toEqual(Number.POSITIVE_INFINITY)
    expect(IntRange.any.clamp(Number.NEGATIVE_INFINITY)).toEqual(Number.NEGATIVE_INFINITY)
  })

  it('throws on NaN', () => {
    expect(() => IntRange.any.clamp(Number.NaN)).toThrow()
  })
})

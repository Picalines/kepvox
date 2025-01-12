import { describe, expect, it } from 'vitest'
import { Range } from './range'

describe('constructor', () => {
  it('throws on min > max', () => {
    expect(() => new Range(10, 5)).toThrow()
  })

  it('throws on NaN', () => {
    expect(() => new Range(Number.NaN, 0)).toThrow()
    expect(() => new Range(0, Number.NaN)).toThrow()
    expect(() => new Range(Number.NaN, Number.NaN)).toThrow()
  })

  it('allows infinity', () => {
    expect(() => new Range(0, Number.POSITIVE_INFINITY)).not.toThrow()
    expect(() => new Range(Number.NEGATIVE_INFINITY, 0)).not.toThrow()
    expect(() => new Range(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)).not.toThrow()
  })

  it('allows min = max', () => {
    expect(() => new Range(10, 10)).not.toThrow()
  })
})

describe('toString', () => {
  it('should allow setting fraction digits', () => {
    const range = new Range(0.125, 5.75)
    expect(range.toString(2)).toEqual('[0.13; 5.75]')
    expect(range.toString(3)).toEqual('[0.125; 5.750]')
  })

  it('should display the infinities', () => {
    expect(Range.any.toString()).toEqual('(-inf; +inf)')
    expect(Range.positive.toString()).toEqual('[0.00; +inf)')
    expect(Range.negative.toString()).toEqual('(-inf; 0.00]')
  })
})

describe('includes', () => {
  it('is inclusive', () => {
    const range = new Range(0, 1)
    expect(range.includes(0)).toEqual(true)
    expect(range.includes(1)).toEqual(true)
  })

  it('throws on NaN', () => {
    const range = new Range(0, 0)
    expect(() => range.includes(Number.NaN)).toThrow()
  })
})

describe('contains', () => {
  it('is inclusive', () => {
    expect(new Range(0, 10).contains(new Range(0, 5))).toEqual(true)
    expect(new Range(0, 10).contains(new Range(5, 10))).toEqual(true)
  })

  it('returns false on bigger range', () => {
    expect(new Range(0, 10).contains(new Range(-10, 10))).toEqual(false)
  })

  it('handles infinity', () => {
    expect(new Range(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY).contains(new Range(0, 1))).toEqual(true)
  })
})

describe('intersection', () => {
  it('returns the smaller inner range', () => {
    expect(new Range(0, 10).intersection(new Range(2, 5))).toEqual(new Range(2, 5))
    expect(new Range(1, 3).intersection(new Range(-20, 20))).toEqual(new Range(1, 3))
  })

  it('handles infinity', () => {
    expect(Range.any.intersection(new Range(0, 1))).toEqual(new Range(0, 1))
    expect(Range.negative.intersection(Range.normal)).toEqual(new Range(0, 0))
  })
})

describe('clamp', () => {
  it('returns min if the value is less than min', () => {
    expect(Range.normal.clamp(-1)).toEqual(0)
  })

  it('returns max if the value is greater than max', () => {
    expect(Range.normal.clamp(2)).toEqual(1)
  })

  it('returns the value if it lies in the range', () => {
    expect(Range.normal.clamp(0)).toEqual(0)
    expect(Range.normal.clamp(0.5)).toEqual(0.5)
    expect(Range.normal.clamp(1)).toEqual(1)
  })

  it('allows Infinity', () => {
    expect(Range.positive.clamp(-100)).toEqual(0)
    expect(Range.negative.clamp(100)).toEqual(0)
    expect(Range.any.clamp(123)).toEqual(123)
    expect(Range.any.clamp(Number.POSITIVE_INFINITY)).toEqual(Number.POSITIVE_INFINITY)
    expect(Range.any.clamp(Number.NEGATIVE_INFINITY)).toEqual(Number.NEGATIVE_INFINITY)
  })

  it('throws on NaN', () => {
    expect(() => Range.any.clamp(Number.NaN)).toThrow()
  })
})

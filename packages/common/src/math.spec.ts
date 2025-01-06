import { clamp, isInRange, isValidRange } from './math'

describe('range', () => {
  describe('isValidRange', () => {
    it('returns false for min > max', () => {
      expect(isValidRange([10, 5])).toEqual(false)
    })

    it('returns false for NaN', () => {
      expect(isValidRange([Number.NaN, 0])).toEqual(false)
      expect(isValidRange([0, Number.NaN])).toEqual(false)
      expect(isValidRange([Number.NaN, Number.NaN])).toEqual(false)
    })

    it('returns true for Infinity', () => {
      expect(isValidRange([0, Number.POSITIVE_INFINITY])).toEqual(true)
      expect(isValidRange([Number.NEGATIVE_INFINITY, 0])).toEqual(true)
      expect(isValidRange([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY])).toEqual(true)
    })
  })

  describe('isInRange', () => {
    it('throws on invalid range', () => {
      expect(() => isInRange(0, [10, 0])).toThrow()
      expect(() => isInRange(0, [0, Number.NaN])).toThrow()
    })

    it('throws on NaN', () => {
      expect(() => isInRange(Number.NaN, [0, 0])).toThrow()
    })
  })
})

describe('clamp', () => {
  it('returns min if the value is less than min', () => {
    expect(clamp(-1, [0, 1])).toEqual(0)
  })

  it('returns max if the value is greater than max', () => {
    expect(clamp(2, [0, 1])).toEqual(1)
  })

  it('returns the value if it lies in the range', () => {
    expect(clamp(0.5, [0, 1])).toEqual(0.5)
    expect(clamp(0, [0, 1])).toEqual(0)
    expect(clamp(1, [0, 1])).toEqual(1)
  })

  it('allows min = max', () => {
    expect(() => clamp(0, [0, 0])).not.toThrow()
  })

  it('allows Infinity', () => {
    expect(clamp(Number.POSITIVE_INFINITY, [0, 1])).toEqual(1)
    expect(clamp(Number.NEGATIVE_INFINITY, [0, 1])).toEqual(0)
    expect(clamp(-100, [Number.NEGATIVE_INFINITY, 1])).toEqual(-100)
    expect(clamp(100, [0, Number.POSITIVE_INFINITY])).toEqual(100)
    expect(clamp(Number.POSITIVE_INFINITY, [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY])).toEqual(
      Number.POSITIVE_INFINITY,
    )
  })

  it('throws on min > max', () => {
    expect(() => clamp(0, [1, 0])).toThrow()
  })

  it('throws on any NaN', () => {
    expect(() => clamp(Number.NaN, [0, 0])).toThrow()
    expect(() => clamp(0, [Number.NaN, 0])).toThrow()
    expect(() => clamp(0, [0, Number.NaN])).toThrow()
  })
})

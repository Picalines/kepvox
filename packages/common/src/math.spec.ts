import { clamp } from './math'

describe('clamp', () => {
  it('returns min if the value is less than min', () => {
    expect(clamp(-1, 0, 1)).toEqual(0)
  })

  it('returns max if the value is greater than max', () => {
    expect(clamp(2, 0, 1)).toEqual(1)
  })

  it('returns the value if it lies in the range', () => {
    expect(clamp(0.5, 0, 1)).toEqual(0.5)
    expect(clamp(0, 0, 1)).toEqual(0)
    expect(clamp(1, 0, 1)).toEqual(1)
  })

  it('allows min = max', () => {
    expect(() => clamp(0, 0, 0)).not.toThrow()
  })

  it('throws on min > max', () => {
    expect(() => clamp(0, 1, 0)).toThrow()
  })

  it('throws on any NaN', () => {
    expect(() => clamp(Number.NaN, 0, 0)).toThrow()
    expect(() => clamp(0, Number.NaN, 0)).toThrow()
    expect(() => clamp(0, 0, Number.NaN)).toThrow()
  })
})

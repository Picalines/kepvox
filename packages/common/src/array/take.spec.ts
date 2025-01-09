import { expect, it } from 'vitest'
import { take } from './take'

it('should take first N items of an array', () => {
  expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3])
})

it("should take less items if there isn't enough", () => {
  expect(take([1, 2, 3], 5)).toEqual([1, 2, 3])
})

it('should throw on invalid length', () => {
  expect(() => take([], -1)).toThrow()
  expect(() => take([], Number.NaN)).toThrow()
})

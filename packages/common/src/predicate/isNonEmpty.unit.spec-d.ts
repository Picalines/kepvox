import { describe, expectTypeOf, it } from 'vitest'
import { isNonEmpty } from './isNonEmpty'

describe('isNonEmpty', () => {
  it('should allow index 0 in true branch', () => {
    const array = [] as number[]
    if (isNonEmpty(array)) {
      expectTypeOf(array[0]).not.toBeUndefined()
    }
  })

  it('should allow index 0 in else branch', () => {
    const array = [] as number[]
    if (!isNonEmpty(array)) {
      return
    }

    expectTypeOf(array[0]).not.toBeUndefined()
  })
})

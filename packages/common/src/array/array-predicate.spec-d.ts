import { describe, expectTypeOf, it } from 'vitest'
import { isNonEmpty, isTuple } from './array-predicate'

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

describe('isTuple', () => {
  it('should convert number literal to  tuple', () => {
    const array = [0]
    if (isTuple(array, 3)) {
      expectTypeOf(array).toEqualTypeOf<[number, number, number]>()
    }
  })
})

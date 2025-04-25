import { describe, expectTypeOf, it } from 'vitest'
import { isTuple } from './isTuple'

describe('isTuple', () => {
  it('should convert number literal to  tuple', () => {
    const array = [0]
    if (isTuple(array, 3)) {
      expectTypeOf(array).toEqualTypeOf<[number, number, number]>()
    }
  })
})

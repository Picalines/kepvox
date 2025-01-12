import { expectTypeOf, it } from 'vitest'
import { isNonEmpty } from './array-predicate'

it('should allow index 0 in true branch', () => {
  const array = [1, 2, 3]
  if (isNonEmpty(array)) {
    expectTypeOf(array[0]).not.toBeUndefined()
  }
})

it('should allow index 0 in else branch', () => {
  const array = [1, 2, 3]
  if (!isNonEmpty(array)) {
    return
  }

  expectTypeOf(array[0]).not.toBeUndefined()
})

import { expect, it } from 'vitest'
import { range } from './range'

it('should yield nothing if the number is <= 0', () => {
  expect([...range(-1)]).toStrictEqual([])
  expect([...range(0)]).toStrictEqual([])
})

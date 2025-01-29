import { expectTypeOf, it } from 'vitest'
import type { Branded } from './branded'

it('separates the inner type', () => {
  expectTypeOf<Branded<number, 'brand'>>().not.toEqualTypeOf<number>()
})

it("doesn't separate the same brands", () => {
  expectTypeOf<Branded<number, 'brand'>>().toEqualTypeOf<Branded<number, 'brand'>>()
})

it('separates the different brands', () => {
  expectTypeOf<Branded<number, '1'>>().not.toEqualTypeOf<Branded<number, '2'>>()
})

it('not allows the literal value', () => {
  expectTypeOf(123).not.toMatchTypeOf<Branded<number, 'brand'>>()
})

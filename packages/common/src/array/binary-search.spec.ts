import { describe, expect, it } from 'vitest'
import { binarySearchFirst, binarySearchLast } from './binary-search'

describe('first', () => {
  it('should find all elements in odd array', () => {
    const array = [10, 30, 100, 999, 2000]

    for (let i = 0; i < array.length; i++) {
      expect(binarySearchFirst(array, x => x - (array[i] as number))).toEqual(i)
    }
  })

  it('should find all elements in even array', () => {
    const array = [10, 30, 100, 999]

    for (let i = 0; i < array.length; i++) {
      expect(binarySearchFirst(array, x => x - (array[i] as number))).toEqual(i)
    }
  })

  it('should return first index of a duplicated element', () => {
    const array = [0, 1, 2, 3, 3, 3, 4]
    expect(binarySearchFirst(array, x => x - 3)).toEqual(3)
  })

  it('should return null if element not found', () => {
    const array = [10, 30, 100, 999]
    expect(binarySearchFirst(array, () => 1)).toEqual(null)
    expect(binarySearchFirst(array, () => -1)).toEqual(null)
  })

  it('should return null for an empty array', () => {
    expect(binarySearchFirst([], () => 1)).toEqual(null)
    expect(binarySearchFirst([], () => -1)).toEqual(null)
    expect(binarySearchFirst([], () => 0)).toEqual(null)
  })
})

describe('last', () => {
  it('should find all elements in odd array', () => {
    const array = [10, 30, 100, 999, 2000]

    for (let i = 0; i < array.length; i++) {
      expect(binarySearchLast(array, x => x - (array[i] as number))).toEqual(i)
    }
  })

  it('should find all elements in even array', () => {
    const array = [10, 30, 100, 999]

    for (let i = 0; i < array.length; i++) {
      expect(binarySearchLast(array, x => x - (array[i] as number))).toEqual(i)
    }
  })

  it('should return last index of a duplicated element', () => {
    const array = [0, 1, 2, 3, 3, 3, 4]
    expect(binarySearchLast(array, x => x - 3)).toEqual(5)
  })

  it('should return null if element not found', () => {
    const array = [10, 30, 100, 999]
    expect(binarySearchLast(array, () => 1)).toEqual(null)
    expect(binarySearchLast(array, () => -1)).toEqual(null)
  })

  it('should return null for an empty array', () => {
    expect(binarySearchLast([], () => 1)).toEqual(null)
    expect(binarySearchLast([], () => -1)).toEqual(null)
    expect(binarySearchLast([], () => 0)).toEqual(null)
  })
})

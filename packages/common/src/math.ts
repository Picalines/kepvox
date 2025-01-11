/**
 * Inclusive
 */
export type Range = [min: number, max: number]

export const isValidRange = ([min, max]: Range) => {
  return !Number.isNaN(min) && !Number.isNaN(max) && min <= max
}

const assertValidRange = (range: Range) => {
  if (!isValidRange(range)) {
    throw new Error('the argument is not a valid range')
  }
}

export const isInRange = (x: number, range: Range) => {
  assertValidRange(range)
  if (Number.isNaN(x)) {
    throw new Error('the argument is NaN')
  }
  const [min, max] = range
  return x >= min && x <= max
}

export const rangeContains = (outerRange: Range, innerRange: Range) => {
  assertValidRange(outerRange)
  assertValidRange(innerRange)
  const [min, max] = innerRange
  return isInRange(min, outerRange) && isInRange(max, outerRange)
}

export const rangeIntersection = (range1: Range, range2: Range): Range | null => {
  assertValidRange(range1)
  assertValidRange(range2)

  const [min1, max1] = range1
  const [min2, max2] = range2
  const intersection: Range = [Math.max(min1, min2), Math.min(max1, max2)]

  return isValidRange(intersection) ? intersection : null
}

export const clamp = (x: number, range: Range) => {
  if (Number.isNaN(x)) {
    throw new Error('the argument is NaN')
  }

  assertValidRange(range)
  const [min, max] = range

  return Math.max(min, Math.min(x, max))
}

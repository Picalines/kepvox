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

export const isRangeIncludes = (outerRange: Range, innerRange: Range) => {
  assertValidRange(outerRange)
  assertValidRange(innerRange)
  const [min, max] = innerRange
  return isInRange(min, outerRange) && isInRange(max, outerRange)
}

export const clamp = (x: number, range: Range) => {
  if (Number.isNaN(x)) {
    throw new Error('the argument is NaN')
  }

  assertValidRange(range)
  const [min, max] = range

  return Math.max(min, Math.min(x, max))
}

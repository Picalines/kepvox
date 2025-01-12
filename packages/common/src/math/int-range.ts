import { Range } from './range'

type MakeRangeInt<T> = T extends Range ? IntRange : T

type RangeIntAPI = {
  [M in keyof Range as M extends `#${string}` ? never : M]: Range[M] extends (
    ...args: infer Args extends any[]
  ) => infer R
    ? (...args: { [I in keyof Args]: MakeRangeInt<Args[I]> }) => MakeRangeInt<R>
    : Range[M]
}

type RoundingMethod = 'floor' | 'ceil' | 'round'

const isIntOrInfinite = (x: number) => Number.isInteger(x) || (!Number.isNaN(x) && !Number.isFinite(x))

export class IntRange implements RangeIntAPI {
  readonly #range: Range

  constructor(min: number, max: number) {
    if (!isIntOrInfinite(min) || !isIntOrInfinite(max) || min > max) {
      throw new Error('the arguments are not a valid integer range')
    }

    this.#range = new Range(min, max)
  }

  get min() {
    return this.#range.min
  }

  get max() {
    return this.#range.max
  }

  get realRange(): Range {
    return this.#range
  }

  toString() {
    return this.#range.toString(0)
  }

  includes(x: number): boolean {
    return this.#range.includes(x) && Number.isInteger(x)
  }

  contains(innerRange: IntRange): boolean {
    return this.#range.contains(innerRange.realRange)
  }

  intersection(range: IntRange): IntRange | null {
    const commonRange = this.#range.intersection(range.realRange)
    return commonRange ? new IntRange(commonRange.min, commonRange.max) : null
  }

  clamp(x: number, roundingMethod: RoundingMethod = 'round'): number {
    return this.#range.clamp(Math[roundingMethod](x))
  }

  static get any() {
    return new IntRange(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
  }

  static get positive() {
    return new IntRange(0, Number.POSITIVE_INFINITY)
  }

  static get negative() {
    return new IntRange(Number.NEGATIVE_INFINITY, 0)
  }

  static get positiveNonZero() {
    return new IntRange(1, Number.POSITIVE_INFINITY)
  }

  static get negativeNonZero() {
    return new IntRange(Number.NEGATIVE_INFINITY, -1)
  }
}

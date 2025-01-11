export class Range {
  readonly #min: number
  readonly #max: number

  constructor(min: number, max: number) {
    if (Number.isNaN(min) || Number.isNaN(max) || min > max) {
      throw new Error('the arguments are not a valid range')
    }

    this.#min = min
    this.#max = max
  }

  get min() {
    return this.#min
  }

  get max() {
    return this.#max
  }

  includes(x: number) {
    if (Number.isNaN(x)) {
      throw new Error('the argument is NaN')
    }
    return x >= this.min && x <= this.max
  }

  contains(innerRange: Range) {
    return this.includes(innerRange.min) && this.includes(innerRange.max)
  }

  intersection(range: Range): Range | null {
    const iMin = Math.max(this.min, range.min)
    const iMax = Math.min(this.max, range.max)
    return iMin <= iMax ? new Range(iMin, iMax) : null
  }

  clamp(x: number) {
    if (Number.isNaN(x)) {
      throw new Error('the argument is NaN')
    }

    return Math.max(this.min, Math.min(x, this.max))
  }

  static get any() {
    return new Range(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
  }

  static get positive() {
    return new Range(0, Number.POSITIVE_INFINITY)
  }

  static get negative() {
    return new Range(Number.NEGATIVE_INFINITY, 0)
  }

  static get positiveNonZero() {
    return new Range(Number.EPSILON, Number.POSITIVE_INFINITY)
  }

  static get negativeNonZero() {
    return new Range(Number.NEGATIVE_INFINITY, -Number.EPSILON)
  }

  static get normal() {
    return new Range(0, 1)
  }
}

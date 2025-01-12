export const synthParamType: unique symbol = Symbol('SynthParam.type')

export type SynthParam<T> = {
  readonly [synthParamType]: string

  getImmediate(): T
  setImmediate(value: T): void
}

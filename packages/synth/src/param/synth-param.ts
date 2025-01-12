export const synthParamType: unique symbol = Symbol('SynthParam.type')

export abstract class SynthParam<T> {
  abstract readonly [synthParamType]: string

  abstract getImmediate(): T

  abstract setImmediate(value: T): void
}

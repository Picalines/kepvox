export const synthParamType: unique symbol = Symbol('SynthParam.type')

export type SynthParam = {
  readonly [synthParamType]: string
}

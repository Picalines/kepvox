export const synthParamType: unique symbol = Symbol('SynthParam.type')

export abstract class SynthParam {
  abstract readonly [synthParamType]: string
}

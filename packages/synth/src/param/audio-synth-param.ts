import { type Range, rangeContains } from '@repo/common/math'
import type { OmitExisting } from '@repo/common/typing'
import type { UnitName } from '#units'
import { ScalarSynthParam } from './scalar-synth-param'
import { type SynthParam, synthParamType } from './synth-param'

export namespace AudioSynthParam {
  export type Opts = OmitExisting<ScalarSynthParam.Opts, 'synchronize'>
}

const hasAssociatedParamSymbol = Symbol('associatedSynthAudioParam')

export class AudioSynthParam implements SynthParam, Omit<ScalarSynthParam, typeof synthParamType> {
  readonly [synthParamType] = 'audio'

  readonly #audioParam: AudioParam

  readonly #scalarParam: ScalarSynthParam

  constructor(nativeAudioParam: AudioParam, opts: AudioSynthParam.Opts) {
    if (hasAssociatedParamSymbol in nativeAudioParam) {
      throw new Error('the AudioParam already has an AudioSynthParam associated with it')
    }

    // @ts-expect-error: adding a custom symbol to prevent "races"
    // between different synth parameters controlling the same AudioParam
    nativeAudioParam[hasAssociatedParamSymbol] = true

    this.#audioParam = nativeAudioParam
    this.#scalarParam = new ScalarSynthParam({
      ...opts,
      synchronize: value => {
        this.#audioParam.value = value
      },
    })

    const nativeRange: Range = [nativeAudioParam.minValue, nativeAudioParam.maxValue]
    if (!rangeContains(nativeRange, this.range)) {
      throw new Error('the param range is larger the native range')
    }
  }

  get unit(): UnitName {
    return this.#scalarParam.unit
  }

  get range(): Range {
    return this.#scalarParam.range
  }

  setValueImmediate(value: number) {
    this.#scalarParam.setValueImmediate(value)
  }

  getValueImmediate() {
    return this.#audioParam.value
  }
}

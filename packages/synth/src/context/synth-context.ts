import { IntRange, Range } from '@repo/common/math'
import { type SynthTime, type SynthTimeLike, createSynthTime } from './synth-time'

export type TimeSignature = readonly [beatsInBar: number, beatValue: number]

export namespace SynthContext {
  export type Opts = {
    /**
     * Beats per minute
     * @default 120
     */
    bpm?: number

    /**
     * @default [4, 4]
     */
    timeSignature?: TimeSignature

    /**
     * A small time interval used to offset from `currentTime`
     *
     * @example ```ts
     * play(currentTime) // wrong, because currentTime is already in the past
     * play(currentTime + lookAhead) // will work with a tiny delay
     * ```
     *
     * @default 0.1
     */
    lookAhead?: number
  }
}

export class SynthContext {
  // @ts-expect-error: initialized by public setter
  #bpm: number
  // @ts-expect-error: initialized by public setter
  #timeSignature: TimeSignature
  // @ts-expect-error: initialized by public setter
  #lookAhead: number

  constructor(
    readonly audioContext: AudioContext,
    opts?: SynthContext.Opts,
  ) {
    const { bpm = 120, timeSignature = [4, 4], lookAhead = 0.1 } = opts ?? {}

    this.bpm = bpm
    this.timeSignature = timeSignature
    this.lookAhead = lookAhead
  }

  get bpm() {
    return this.#bpm
  }

  set bpm(value) {
    this.#bpm = Range.positiveNonZero.clamp(value)
  }

  get timeSignature() {
    return this.#timeSignature
  }

  set timeSignature([beatsInBar, beatValue]) {
    this.#timeSignature = [IntRange.positiveNonZero.clamp(beatsInBar), IntRange.positiveNonZero.clamp(beatValue)]
  }

  get lookAhead() {
    return this.#lookAhead
  }

  set lookAhead(value) {
    this.#lookAhead = Range.positiveNonZero.clamp(value)
  }

  get currentTime(): SynthTime {
    return createSynthTime(this, this.audioContext.currentTime)
  }

  time(time: SynthTimeLike): SynthTime {
    return createSynthTime(this, time)
  }
}

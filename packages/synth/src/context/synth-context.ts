import { Emitter } from '@repo/common/emitter'
import { IntRange, Range } from '@repo/common/math'
import { AutomationCurve } from '#param'
import { type Seconds, createSeconds } from '#units'
import { SynthTime } from './synth-time'

type TimeSignature = readonly [beatsInBar: number, beatsInNote: number]

export namespace SynthContext {
  export type Opts = {
    /**
     * Initial beats per minute
     * @default 120
     */
    bpm?: number

    /**
     * NOTE: changing the time during playback is an undefined behavior
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
    lookAhead?: Seconds
  }
}

type Events = {
  play: [start: SynthTime]
  stop: []
}

export class SynthContext extends Emitter.listenMixin<Events>()(Object) {
  /**
   * AutomationCurve that maps musical beats to seconds.
   * {@link AutomationCurve.areaBefore} gives you the number of seconds
   * your composition will have played up to given beat
   */
  readonly secondsPerBeat: AutomationCurve

  // @ts-expect-error: initialized by public setter
  #timeSignature: TimeSignature
  // @ts-expect-error: initialized by public setter
  #lookAhead: Seconds

  constructor(
    readonly audioContext: AudioContext,
    opts?: SynthContext.Opts,
  ) {
    super()

    const { bpm: initialBpm = 120, timeSignature = [4, 4], lookAhead = 0.1 } = opts ?? {}

    this.timeSignature = timeSignature
    this.lookAhead = createSeconds(lookAhead)

    this.secondsPerBeat = new AutomationCurve(this, { valueRange: Range.positiveNonZero })

    this.secondsPerBeat.setValueAt(this.firstBeat, 60 / initialBpm)
  }

  get timeSignature() {
    return this.#timeSignature
  }

  set timeSignature([beatsInBar, beatValue]) {
    this.#timeSignature = [IntRange.positiveNonZero.clamp(beatsInBar), IntRange.positiveNonZero.clamp(beatValue)]
  }

  get lookAhead(): Seconds {
    return this.#lookAhead
  }

  set lookAhead(value) {
    this.#lookAhead = createSeconds(Range.positiveNonZero.clamp(value))
  }

  get scheduleTime(): Seconds {
    return createSeconds(this.audioContext.currentTime + this.lookAhead)
  }

  time(units: NonNullable<ConstructorParameters<typeof SynthTime>[1]>): SynthTime {
    return new SynthTime(this, units)
  }

  readonly firstBeat = this.time({ beat: 0 })

  play(start = this.firstBeat) {
    this.stop()
    this._emit('play', start)
  }

  stop() {
    this._emit('stop')
  }
}

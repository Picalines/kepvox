import { INTERNAL_AUDIO_CONTEXT, INTERNAL_CONTEXT_OWN } from '#internal-symbols'
import { IntRange, Range } from '#math'
import { AutomationCurve } from '#param'
import { type Seconds, createSeconds } from '#units'
import { type Disposable, DisposableStack } from '#util/disposable'
import { Emitter, type ListenEmitter } from '#util/emitter'
import { SynthTime } from './synth-time'

type TimeSignature = readonly [beatsInBar: number, beatsInNote: number]

export type SynthContextOpts = {
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

export type SynthState = 'idle' | 'playing' | 'disposed'

type Events = {
  play: [start: SynthTime]
  stop: []
  stateChanged: []
}

export class SynthContext implements ListenEmitter<Events>, Disposable {
  /**
   * AutomationCurve that maps musical beats to seconds.
   * {@link AutomationCurve.areaBefore} gives you the number of seconds
   * your composition will have played up to given beat
   */
  readonly secondsPerBeat: AutomationCurve

  readonly #audioContext: AudioContext

  readonly #resources = new DisposableStack()

  readonly #emitter = new Emitter<Events>()
  readonly on = this.#emitter.on.bind(this.#emitter)
  readonly off = this.#emitter.off.bind(this.#emitter)
  readonly once = this.#emitter.once.bind(this.#emitter)

  #state: SynthState = 'idle'

  // @ts-expect-error: initialized by public setter
  #timeSignature: TimeSignature
  // @ts-expect-error: initialized by public setter
  #lookAhead: Seconds

  constructor(audioContext: AudioContext, opts?: SynthContextOpts) {
    const { bpm: initialBpm = 120, timeSignature = [4, 4], lookAhead = 0.1 } = opts ?? {}

    this.#audioContext = audioContext

    this.timeSignature = timeSignature
    this.lookAhead = createSeconds(lookAhead)

    this.secondsPerBeat = new AutomationCurve(this, { valueRange: Range.positiveNonZero })

    this.secondsPerBeat.setValueAt(this.firstBeat, 60 / initialBpm)

    audioContext.addEventListener('statechange', () => {
      switch (audioContext.state) {
        case 'suspended':
          this.stop()
          return
        case 'closed':
          this.dispose()
          return
      }
    })

    if (audioContext.state === 'closed') {
      this.dispose()
    }
  }

  get state() {
    return this.#state
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
    return createSeconds(this.#audioContext.currentTime + this.lookAhead)
  }

  time(units: NonNullable<ConstructorParameters<typeof SynthTime>[1]>): SynthTime {
    return new SynthTime(this, units)
  }

  readonly firstBeat = this.time({ beat: 0 })

  /**
   * NOTE: may be called multiple times without {@link SynthContext.stop}
   */
  play(start = this.firstBeat) {
    this.#assertNotDisposed()
    this.stop()
    this.#audioContext.resume().then(() => {
      this.#state = 'playing'
      this.#emitter.emit('play', start)
      this.#emitter.emit('stateChanged')
    })
  }

  stop() {
    this.#assertNotDisposed()
    if (this.#state === 'playing') {
      this.#state = 'idle'
      this.#emitter.emit('stop')
      this.#emitter.emit('stateChanged')
    }
  }

  /**
   * Disposes all SynthNodes associated with the context
   */
  dispose() {
    this.stop()
    this.#state = 'disposed'
    this.#resources.dispose()
    this.#emitter.emit('stateChanged')
  }

  get disposed() {
    return this.#resources.disposed
  }

  /**
   * Adds the disposable to the private stack
   * @internal
   */
  [INTERNAL_CONTEXT_OWN](resource: Disposable) {
    this.#resources.add(resource)
  }

  get [INTERNAL_AUDIO_CONTEXT]() {
    return this.#audioContext
  }

  #assertNotDisposed() {
    if (this.#resources.disposed.aborted) {
      throw new Error('the SynthContext is used while being disposed')
    }
  }
}

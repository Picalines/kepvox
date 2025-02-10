import { AutomationCurve } from '#automation'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { IntRange, Range } from '#math'
import { OutputSynthNode } from '#node'
import { SynthTime } from '#time'
import { Seconds } from '#units'
import { Signal } from '#util/signal'

type TimeSignature = readonly [beatsInBar: number, beatsInNote: number]

export type SynthContextOpts = {
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

export class SynthContext {
  /**
   * AutomationCurve that maps whole notes to seconds.
   * {@link AutomationCurve.areaBefore} gives you the number of seconds
   * your composition will have played up to given beat
   */
  readonly secondsPerNote: AutomationCurve<'seconds'>

  readonly #audioContext: AudioContext

  readonly #output: OutputSynthNode

  #state: SynthState = 'idle'

  // @ts-expect-error: initialized by public setter
  #timeSignature: TimeSignature
  // @ts-expect-error: initialized by public setter
  #lookAhead: Seconds

  readonly #playing = Signal.controlled<{ start: SynthTime }>()
  readonly #stopped = Signal.controlled<{}>()
  readonly #stateChanged = Signal.controlled<{}>()
  readonly #disposed = Signal.controlled<null>({ once: true, reverseOrder: true })

  constructor(audioContext: AudioContext, opts?: SynthContextOpts) {
    const { timeSignature = [4, 4], lookAhead = 0.1 } = opts ?? {}

    this.#audioContext = audioContext
    this.#output = new OutputSynthNode(this)

    this.timeSignature = timeSignature
    this.lookAhead = Seconds.orClamp(lookAhead)

    this.secondsPerNote = new AutomationCurve({
      unit: 'seconds',
      initialValue: Seconds.orClamp(2), // 120 bpm in 4/4
      valueRange: Range.positiveNonZero,
    })

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
    this.#lookAhead = Seconds.orClamp(Range.positiveNonZero.clamp(value))
  }

  get scheduleTime(): Seconds {
    return Seconds.orClamp(this.#audioContext.currentTime + this.lookAhead)
  }

  get output(): OutputSynthNode {
    return this.#output
  }

  get playing() {
    return this.#playing.signal
  }

  get stopped() {
    return this.#stopped.signal
  }

  get stateChanged() {
    return this.#stateChanged.signal
  }

  get disposed() {
    return this.#disposed.signal
  }

  measure(measureIndex: number): SynthTime {
    const [notesInBar, _] = this.timeSignature
    return SynthTime.note.repeat(notesInBar * measureIndex)
  }

  /**
   * NOTE: may be called multiple times without {@link SynthContext.stop}
   */
  play(start = SynthTime.start) {
    this.#assertNotDisposed()
    this.stop()
    this.#audioContext.resume().then(() => {
      this.#state = 'playing'
      this.#playing.emit({ start })
      this.#stateChanged.emit({})
    })
  }

  stop() {
    this.#assertNotDisposed()
    if (this.#state === 'playing') {
      this.#state = 'idle'
      this.#stopped.emit({})
      this.#stateChanged.emit({})
    }
  }

  /**
   * Disposes all SynthNodes associated with the context
   */
  dispose() {
    this.stop()
    this.#state = 'disposed'
    this.#disposed.emit(null)
    this.#stateChanged.emit({})

    this.#playing.cancelAll()
    this.#stopped.cancelAll()
    this.#stateChanged.cancelAll()
  }

  get [INTERNAL_AUDIO_CONTEXT]() {
    return this.#audioContext
  }

  #assertNotDisposed() {
    if (this.#disposed.signal.emitted) {
      throw new Error('the SynthContext is used while being disposed')
    }
  }
}

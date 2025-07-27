import { AutomationCurve, automateAudioParam } from '#automation'
import { INTERNAL_AUDIO_CONTEXT, INTERNAL_LOOK_AHEAD } from '#internal-symbols'
import { Range } from '#math'
import { OutputSynthNode } from '#node'
import { Signal } from '#signal'
import { Time } from '#time'
import { Notes, Seconds } from '#units'
import { createSeededRandom } from './seeded-random'

export type SynthOpts = {
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
  /**
   * A number that determines all random computations during audio scheduling.
   * See {@link Synth.random}
   */
  randomSeed?: number
}

export type SynthState = 'idle' | 'playing' | 'disposed'

export class Synth {
  /**
   * AutomationCurve that maps whole notes to seconds.
   * {@link AutomationCurve.areaBefore} gives you the number of seconds
   * your composition will have played up to given beat
   */
  readonly secondsPerNote: AutomationCurve<'seconds'>

  /**
   * Seeded random number generator
   */
  readonly random: () => number

  readonly #playing = Signal.controlled<{ start: Time }>()
  readonly #stopped = Signal.controlled<{}>()
  readonly #stateChanged = Signal.controlled<{}>()
  readonly #disposed = Signal.controlled<null>({ once: true, reverseOrder: true })

  readonly #audioContext: AudioContext | OfflineAudioContext
  readonly #lookAhead: Seconds

  readonly #output: OutputSynthNode

  #state: SynthState = 'idle'
  #playbackSkippedSeconds = Seconds(0)
  #playbackStartTime = Seconds(0)

  /**
   * Dummy audio node for {@link elapsedNotes}. We use its AudioParam
   * to map seconds to {@link Time}.
   */
  readonly #notesPerSecondNode: PannerNode

  constructor(audioContext: AudioContext | OfflineAudioContext, opts?: SynthOpts) {
    const { lookAhead = 0.1, randomSeed = 0 } = opts ?? {}

    this.#audioContext = audioContext
    this.#lookAhead = Seconds.orClamp(Range.positiveNonZero.clamp(lookAhead))
    this.#output = new OutputSynthNode(this)

    this.secondsPerNote = new AutomationCurve({
      unit: 'seconds',
      initialValue: Seconds.orClamp(2), // 120 bpm in 4/4
      valueRange: Range.positiveNonZero,
    })

    this.random = createSeededRandom(randomSeed)

    this.playing.watch(({ start }) => {
      this.#playbackSkippedSeconds = this.durationAt(start)
      this.#playbackStartTime = Seconds(this.#audioContext.currentTime + this.#lookAhead)
    })

    this.secondsPerNote.changed.watch(() => this.stop())

    this.#notesPerSecondNode = audioContext.createPanner()
    this.#notesPerSecondNode.connect(audioContext.destination) // won't work without connection
    this.disposed.watch(() => this.#notesPerSecondNode.disconnect())

    automateAudioParam({
      synth: this,
      audioParam: this.#notesPerSecondNode.positionX,
      curve: this.secondsPerNote,
      map: (_, time) => time.toNotes(),
      until: this.disposed,
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

  get elapsedSeconds(): Seconds {
    return Seconds(
      this.state === 'playing'
        ? this.#playbackSkippedSeconds + Math.max(0, this.#audioContext.currentTime - this.#playbackStartTime)
        : 0,
    )
  }

  get elapsedNotes(): Notes {
    if (this.state !== 'playing') {
      return Notes(0)
    }

    const elapsedSeconds = this.elapsedSeconds
    const [, tempoAutomationEnd] = this.secondsPerNote.timeRange
    const tempoAutomationEndSeconds = this.durationAt(tempoAutomationEnd)

    // See the constructor. If the tempo automation is active,
    // use its current value as the result
    if (elapsedSeconds <= tempoAutomationEndSeconds) {
      return Notes(this.#notesPerSecondNode.positionX.value)
    }

    // If the tempo automation have ended, we know that the elapsedNotes should
    // increase linearly, and the "slope" is determined by secondsPerNote
    const constantNoteDuration = this.secondsPerNote.valueAt(tempoAutomationEnd)
    const secondsSinceAutomationEnd = elapsedSeconds - tempoAutomationEndSeconds
    return Notes(tempoAutomationEnd.toNotes() + secondsSinceAutomationEnd / constantNoteDuration)
  }

  /**
   * @returns number of seconds that would've played at a given note
   */
  durationAt(time: Time): Seconds {
    return Seconds(this.secondsPerNote.areaBefore(time))
  }

  /**
   * Starts scheduled time events. Calls {@link Synth#stop} and {@link AudioContext#resume} when needed
   * @returns a Promise that resolves then the state becomes 'playing'
   */
  async play(start = Time.start) {
    this.#assertNotDisposed()
    this.stop()

    if (this.#audioContext instanceof AudioContext && this.#audioContext.state === 'suspended') {
      await this.#audioContext.resume()
    }

    this.#state = 'playing'
    this.#playing.emit({ start })
    this.#stateChanged.emit({})
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
   * Disposes all SynthNodes associated with the synth
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

  get [INTERNAL_LOOK_AHEAD]() {
    return this.#lookAhead
  }

  #assertNotDisposed() {
    if (this.#disposed.signal.emitted) {
      throw new Error('the Synth is used while being disposed')
    }
  }
}

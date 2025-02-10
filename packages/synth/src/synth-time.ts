import { Notes, Ticks } from '#units'

const TICKS_IN_NOTE = Ticks.orThrow(64)

export class SynthTime {
  static readonly start = new SynthTime(Ticks.orThrow(0))

  static readonly note = new SynthTime(Ticks.orThrow(TICKS_IN_NOTE))
  static readonly half = new SynthTime(Ticks.orThrow(TICKS_IN_NOTE / 2))
  static readonly quarter = new SynthTime(Ticks.orThrow(TICKS_IN_NOTE / 4))
  static readonly eighth = new SynthTime(Ticks.orThrow(TICKS_IN_NOTE / 8))
  static readonly sixteenth = new SynthTime(Ticks.orThrow(TICKS_IN_NOTE / 16))
  static readonly thirtySecond = new SynthTime(Ticks.orThrow(TICKS_IN_NOTE / 32))
  static readonly sixtyFourth = new SynthTime(Ticks.orThrow(TICKS_IN_NOTE / 64))

  readonly #ticks: Ticks

  private constructor(ticks: Ticks) {
    this.#ticks = ticks
  }

  static fromTicks(ticks: Ticks) {
    return new SynthTime(ticks)
  }

  static fromNotes(notes: Notes) {
    return SynthTime.note.repeat(notes)
  }

  add(time: SynthTime): SynthTime {
    return new SynthTime(Ticks.orClamp(this.#ticks + time.#ticks))
  }

  sub(time: SynthTime): SynthTime {
    return new SynthTime(Ticks.orClamp(this.#ticks - time.#ticks))
  }

  repeat(times: number): SynthTime {
    return new SynthTime(Ticks.orClamp(this.#ticks * times))
  }

  toNotes(): Notes {
    return Notes.orThrow(this.#ticks / TICKS_IN_NOTE)
  }

  /**
   * Intended for serialization. Don't rely on how long ticks are,
   * it's easier to use relative note values. Change the time signature if you
   * want to speed up your composition
   */
  toTicks(): Ticks {
    return this.#ticks
  }

  equals(time: SynthTime) {
    return this.#ticks === time.#ticks
  }

  isAfter(time: SynthTime) {
    return this.#ticks > time.#ticks
  }

  isAfterOrAt(time: SynthTime) {
    return this.#ticks >= time.#ticks
  }

  isBefore(time: SynthTime) {
    return this.#ticks < time.#ticks
  }

  isBeforeOrAt(time: SynthTime) {
    return this.#ticks <= time.#ticks
  }
}

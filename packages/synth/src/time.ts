import { Notes, Ticks } from '#units'

const TICKS_IN_NOTE = 64

export class Time {
  static readonly start = new Time(Ticks(0))

  static readonly note = new Time(Ticks(TICKS_IN_NOTE))
  static readonly half = new Time(Ticks(TICKS_IN_NOTE / 2))
  static readonly quarter = new Time(Ticks(TICKS_IN_NOTE / 4))
  static readonly eighth = new Time(Ticks(TICKS_IN_NOTE / 8))
  static readonly sixteenth = new Time(Ticks(TICKS_IN_NOTE / 16))
  static readonly thirtySecond = new Time(Ticks(TICKS_IN_NOTE / 32))
  static readonly sixtyFourth = new Time(Ticks(TICKS_IN_NOTE / 64))

  readonly #ticks: Ticks

  private constructor(ticks: Ticks) {
    this.#ticks = ticks
  }

  static atTick(ticks: Ticks) {
    return new Time(ticks)
  }

  static atNote(notes: Notes) {
    return Time.note.repeat(notes)
  }

  add(time: Time): Time {
    return new Time(Ticks.orClamp(this.#ticks + time.#ticks))
  }

  sub(time: Time): Time {
    return new Time(Ticks.orClamp(this.#ticks - time.#ticks))
  }

  min(time: Time): Time {
    return this.#ticks <= time.#ticks ? this : time
  }

  max(time: Time): Time {
    return this.#ticks >= time.#ticks ? this : time
  }

  repeat(times: number): Time {
    return new Time(Ticks.orClamp(this.#ticks * times))
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

  equals(time: Time) {
    return this.#ticks === time.#ticks
  }

  isAfter(time: Time) {
    return this.#ticks > time.#ticks
  }

  isAfterOrAt(time: Time) {
    return this.#ticks >= time.#ticks
  }

  isBefore(time: Time) {
    return this.#ticks < time.#ticks
  }

  isBeforeOrAt(time: Time) {
    return this.#ticks <= time.#ticks
  }
}

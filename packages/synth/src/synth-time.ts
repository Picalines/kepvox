import { type Beats, type Notes, Unit } from '#units'
import type { SynthContext } from './synth-context'

type SynthTimeUnit = 'note' | 'note2' | 'note4' | 'note8' | 'note16'

type SynthTimeUnitMap = Partial<Record<SynthTimeUnit, number>>

export class SynthTime {
  static readonly start = new SynthTime()

  readonly #quarterNotes: number

  constructor(units: SynthTimeUnitMap = {}) {
    this.#quarterNotes =
      (units.note ?? 0) * 4 +
      (units.note2 ?? 0) * 2 +
      (units.note4 ?? 0) +
      (units.note8 ?? 0) / 2 +
      (units.note16 ?? 0) / 4
  }

  add(time: SynthTime | SynthTimeUnitMap): SynthTime {
    const synthTime = time instanceof SynthTime ? time : new SynthTime(time)
    return new SynthTime({ note4: this.#quarterNotes + synthTime.#quarterNotes })
  }

  toBeats(context: SynthContext): Beats {
    const [_, beatsInNote] = context.timeSignature
    return Unit.beats.orThrow(beatsInNote * (this.#quarterNotes / 4))
  }

  toNotes(): Notes {
    return Unit.notes.orThrow(this.#quarterNotes / 4)
  }

  equals(time: SynthTime) {
    return this.#quarterNotes === time.#quarterNotes
  }

  isAfter(time: SynthTime) {
    return this.#quarterNotes > time.#quarterNotes
  }

  isAfterOrAt(time: SynthTime) {
    return this.#quarterNotes >= time.#quarterNotes
  }

  isBefore(time: SynthTime) {
    return this.#quarterNotes < time.#quarterNotes
  }

  isBeforeOrAt(time: SynthTime) {
    return this.#quarterNotes <= time.#quarterNotes
  }
}

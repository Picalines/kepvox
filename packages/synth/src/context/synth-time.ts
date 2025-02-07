import { type Beats, Unit } from '#units'
import type { SynthContext } from './synth-context'

type SynthTimeUnit = 'beat' | 'measure' | 'note' | 'note2' | 'note4' | 'note8' | 'note16'

const toBeatsTable: Record<SynthTimeUnit, (value: number, context: SynthContext) => number> = {
  beat: beats => beats,
  measure: (bars, { timeSignature: [beatsInBar, _] }) => beatsInBar * bars,
  note: (notes, { timeSignature: [_, beatsInNote] }) => beatsInNote * notes,
  note2: (notes, { timeSignature: [_, beatsInNote] }) => (beatsInNote / 2) * notes,
  note4: (notes, { timeSignature: [_, beatsInNote] }) => (beatsInNote / 4) * notes,
  note8: (notes, { timeSignature: [_, beatsInNote] }) => (beatsInNote / 8) * notes,
  note16: (notes, { timeSignature: [_, beatsInNote] }) => (beatsInNote / 16) * notes,
}

type SynthTimeUnitMap = Partial<Record<SynthTimeUnit, number>>

export class SynthTime {
  readonly beats: Beats

  readonly #context: SynthContext

  /**
   * If nothing is passed, the time is at zero
   */
  constructor(context: SynthContext, units: SynthTimeUnitMap = {}) {
    this.#context = context
    this.beats = this.#unitsToBeats(units)
  }

  get context() {
    return this.#context
  }

  add(time: SynthTime | SynthTimeUnitMap): SynthTime {
    return new SynthTime(this.#context, {
      beat: this.beats + (time instanceof SynthTime ? time.beats : this.#unitsToBeats(time)),
    })
  }

  equals(time: SynthTime) {
    return this.beats === time.beats
  }

  isAfter(time: SynthTime) {
    return this.beats > time.beats
  }

  isAfterOrAt(time: SynthTime) {
    return this.beats >= time.beats
  }

  isBefore(time: SynthTime) {
    return this.beats < time.beats
  }

  isBeforeOrAt(time: SynthTime) {
    return this.beats <= time.beats
  }

  #unitsToBeats(units: SynthTimeUnitMap): Beats {
    let totalBeats = 0

    for (const [unit, value] of Object.entries(units)) {
      if (Number.isNaN(value)) {
        throw new Error(`${unit} value is NaN`)
      }

      if (!Number.isFinite(value)) {
        throw new Error(`${unit} value is not finite`)
      }

      const timeUnit = unit as SynthTimeUnit
      totalBeats += toBeatsTable[timeUnit](value, this.#context)
    }

    return Unit.beats.orThrow(totalBeats)
  }
}

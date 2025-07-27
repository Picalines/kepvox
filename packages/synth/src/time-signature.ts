import { Range } from '#math'
import { Seconds } from '#units'

export class TimeSignature {
  readonly #beatsInBar: number
  readonly #beatsInNote: number

  constructor(beatsInBar: number, beatsInNote: number) {
    this.#beatsInBar = Range.positiveNonZero.clamp(beatsInBar)
    this.#beatsInNote = Range.positiveNonZero.clamp(beatsInNote)
  }

  get beatsInBar() {
    return this.#beatsInBar
  }

  get beatsInNote() {
    return this.#beatsInNote
  }

  /**
   * Useful for {@link Synth.secondsPerNote}
   */
  bpmToSecondsPerNote(bpm: number): Seconds {
    return Seconds.orClamp((60 / Range.positiveNonZero.clamp(bpm)) * this.beatsInNote)
  }

  toString() {
    return `${this.beatsInBar}/${this.beatsInNote}`
  }
}

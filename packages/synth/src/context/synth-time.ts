import { type Seconds, createSeconds } from '#units'
import type { SynthContext } from './synth-context'

type SynthTimeUnit = 'seconds' | 'milliseconds' | 'hertz' | 'bar' | 'note'

export type SynthTime = Seconds

export type SynthTimeLike =
  | SynthTime
  | number
  | (Partial<Record<SynthTimeUnit, number>> & {
      from?: 'current' | 'ahead'
    })

const toSecondsTable: Record<SynthTimeUnit, (value: number, context: SynthContext) => number> = {
  seconds: s => s,
  milliseconds: ms => ms / 1_000,
  hertz: hz => 1 / hz,
  bar: (bars, { bpm, timeSignature: [beatsInBar, _] }) => (60 / bpm) * beatsInBar * bars,
  note: (noteValue, { bpm, timeSignature: [_, beatValue] }) => (60 / bpm) * (beatValue / noteValue),
}

/**
 * @internal
 */
export const createSynthTime = (context: SynthContext, timeLike: SynthTimeLike): SynthTime => {
  if (typeof timeLike === 'number') {
    return createSeconds(timeLike)
  }

  const { from, ...units } = timeLike
  let totalSeconds = 0

  for (const [unit, value] of Object.entries(units)) {
    if (Number.isNaN(value)) {
      throw new Error(`the ${unit} value is NaN`)
    }

    const timeUnit = unit as SynthTimeUnit
    totalSeconds += toSecondsTable[timeUnit](value, context)
  }

  if (from === 'current') {
    totalSeconds += context.currentTime
  } else if (from === 'ahead') {
    totalSeconds += context.currentTime + context.lookAhead
  }

  return createSeconds(totalSeconds)
}

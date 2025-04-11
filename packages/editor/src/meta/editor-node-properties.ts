import { Pitch, type UnitName } from '@repo/synth'

/**
 * synth package declares only "physical" ranges. Override them
 * here to show more sensible range in the editor
 */
export const USER_UNIT_RANGES: Partial<Record<UnitName, { min: number; max: number }>> = {
  seconds: { min: 0, max: 30 },
  notes: { min: 0, max: 64 },
  decibels: { min: -80, max: 5 },
  hertz: { min: 0, max: Pitch.frequency('B9') },
  nonNegative: { min: 0, max: 100 },
  factor: { min: -5, max: 5 },
}

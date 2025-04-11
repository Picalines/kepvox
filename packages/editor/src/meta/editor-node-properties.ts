import { Pitch, type UnitName } from '@repo/synth'

/**
 * synth package declares only "physical" ranges. Override them
 * here to show more sensible range in the editor
 */
export const USER_UNIT_RANGES: Partial<Record<UnitName, { min: number; max: number }>> = {
  notes: { min: 0, max: 64 },
  hertz: { min: 0, max: Pitch.frequency('B9') },
}

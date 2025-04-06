import {
  DelaySynthNode,
  GainSynthNode,
  GeneratorSynthNode,
  OscillatorSynthNode,
  Pitch,
  ReverbSynthNode,
  type SynthContext,
  type SynthNode,
  type UnitName,
} from '@repo/synth'

export const CREATABLE_SYNTH_NODES = {
  delay: DelaySynthNode,
  gain: GainSynthNode,
  generator: GeneratorSynthNode,
  oscillator: OscillatorSynthNode,
  reverb: ReverbSynthNode,
} satisfies Record<string, { new (context: SynthContext): SynthNode }>

/**
 * synth package declares only "physical" ranges. Override them
 * here to show more sensible range in the editor
 */
export const USER_UNIT_RANGES: Partial<Record<UnitName, { min: number; max: number }>> = {
  notes: { min: 0, max: 64 },
  hertz: { min: 0, max: Pitch.frequency('B9') },
}

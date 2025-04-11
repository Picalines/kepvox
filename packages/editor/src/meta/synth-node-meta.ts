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

export const NODE_TYPES = ['output', 'delay', 'gain', 'generator', 'oscillator', 'reverb'] as const

export const NODE_SYNTH_CONSTRUCTORS = {
  delay: DelaySynthNode,
  gain: GainSynthNode,
  generator: GeneratorSynthNode,
  oscillator: OscillatorSynthNode,
  reverb: ReverbSynthNode,
} satisfies Partial<Record<(typeof NODE_TYPES)[number], { new (context: SynthContext): SynthNode }>>

/**
 * synth package declares only "physical" ranges. Override them
 * here to show more sensible range in the editor
 */
export const USER_UNIT_RANGES: Partial<Record<UnitName, { min: number; max: number }>> = {
  notes: { min: 0, max: 64 },
  hertz: { min: 0, max: Pitch.frequency('B9') },
}

export const NODE_COLORS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'zinc',
] as const

type NodeColor = (typeof NODE_COLORS)[number]

export const DEFAULT_NODE_COLORS: Record<'output' | keyof typeof NODE_SYNTH_CONSTRUCTORS, NodeColor> = {
  output: 'zinc',
  delay: 'teal',
  gain: 'amber',
  generator: 'emerald',
  oscillator: 'lime',
  reverb: 'orange',
}

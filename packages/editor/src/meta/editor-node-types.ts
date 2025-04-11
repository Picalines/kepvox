import {
  DelaySynthNode,
  GainSynthNode,
  GeneratorSynthNode,
  OscillatorSynthNode,
  ReverbSynthNode,
  type SynthContext,
  type SynthNode,
} from '@repo/synth'

export const NODE_TYPES = ['output', 'delay', 'gain', 'generator', 'oscillator', 'reverb'] as const

export const NODE_SYNTH_CONSTRUCTORS = {
  delay: DelaySynthNode,
  gain: GainSynthNode,
  generator: GeneratorSynthNode,
  oscillator: OscillatorSynthNode,
  reverb: ReverbSynthNode,
} satisfies Partial<Record<(typeof NODE_TYPES)[number], { new (context: SynthContext): SynthNode }>>

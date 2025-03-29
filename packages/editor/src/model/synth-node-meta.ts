import {
  ADSREnvelopeSynthNode,
  ConstantSynthNode,
  DelaySynthNode,
  GainSynthNode,
  GeneratorSynthNode,
  OscillatorSynthNode,
  ReverbSynthNode,
  type SynthContext,
  type SynthNode,
} from '@repo/synth'

export const CREATABLE_SYNTH_NODES = {
  'adsr-envelope': ADSREnvelopeSynthNode,
  constant: ConstantSynthNode,
  delay: DelaySynthNode,
  gain: GainSynthNode,
  generator: GeneratorSynthNode,
  oscillator: OscillatorSynthNode,
  reverb: ReverbSynthNode,
} satisfies Record<string, { new (context: SynthContext): SynthNode }>

import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import type { Synth } from '#synth'
import { SynthNode } from '../synth-node'

export class OutputSynthNode extends SynthNode {
  /**
   * NOTE: you should get the instance from {@link Synth.output}
   */
  constructor(synth: Synth) {
    const { destination } = synth[INTERNAL_AUDIO_CONTEXT]

    super({ synth, inputs: [destination], outputs: [] })
  }
}

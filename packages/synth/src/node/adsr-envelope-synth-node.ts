import type { SynthContext, SynthTime } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { AudioSynthParam, ScalarSynthParam } from '#param'
import { SynthNode, synthNodeType } from './synth-node'

export class ADSREnvelopeSynthNode extends SynthNode {
  readonly [synthNodeType] = 'adsr-envelope'

  readonly attack: ScalarSynthParam
  readonly decay: ScalarSynthParam
  readonly sustain: ScalarSynthParam
  readonly release: ScalarSynthParam

  readonly #gainNode: AudioNode
  readonly #gain: AudioSynthParam

  constructor(context: SynthContext) {
    const gainNode = context[INTERNAL_AUDIO_CONTEXT].createGain()

    super({ context, inputs: [gainNode], outputs: [gainNode] })

    this.#gainNode = gainNode
    this.#gain = new AudioSynthParam(gainNode.gain, {
      context,
      unit: 'factor',
      initialValue: 0,
    })

    this.attack = new ScalarSynthParam({
      context,
      unit: 'beats',
      initialValue: 0,
      range: Range.positive,
    })

    this.decay = new ScalarSynthParam({
      context,
      unit: 'beats',
      initialValue: 0,
      range: Range.positive,
    })

    this.sustain = new ScalarSynthParam({
      context,
      unit: 'normalRange',
      initialValue: 1,
    })

    this.release = new ScalarSynthParam({
      context,
      unit: 'beats',
      initialValue: 0,
      range: Range.positive,
    })
  }

  attackAt(start: SynthTime) {
    const gain = this.#gain.curve

    const attackDuration = this.attack.curve.valueAt(start)
    const attackEnd = start.add({ beat: attackDuration })

    const decayDuration = this.decay.curve.valueAt(attackEnd)
    const decayEnd = attackEnd.add({ beat: decayDuration })

    const sustainLevel = this.sustain.curve.valueAt(decayEnd)

    gain.holdValueAt(start)
    gain.rampValueUntil(attackEnd, 1, 'linear')

    if (decayDuration > 0) {
      gain.rampValueUntil(decayEnd, sustainLevel, 'linear')
    } else {
      gain.setValueAt(decayEnd, attackDuration > 0 ? 1 : sustainLevel)
    }
  }

  releaseAt(start: SynthTime) {
    const gain = this.#gain.curve

    gain.holdValueAt(start)

    const releaseDuration = this.release.curve.valueAt(start)
    const releaseEnd = start.add({ beat: releaseDuration })

    if (releaseDuration > 0) {
      gain.rampValueUntil(releaseEnd, 0)
    } else {
      // TODO: maybe a better solution
      gain.setValueAt(releaseEnd.add({ beat: Number.EPSILON }), 0)
    }
  }

  override dispose(): void {
    super.dispose()
    this.#gainNode.disconnect()
  }
}

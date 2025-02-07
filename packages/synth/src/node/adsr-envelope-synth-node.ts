import type { SynthContext, SynthTime } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { AudioSynthParam, ScalarSynthParam } from '#param'
import { Unit } from '#units'
import { SynthNode, synthNodeType } from './synth-node'

export class ADSREnvelopeSynthNode extends SynthNode {
  readonly [synthNodeType] = 'adsr-envelope'

  readonly attack
  readonly decay
  readonly sustain
  readonly release

  readonly #gainNode
  readonly #gain

  constructor(context: SynthContext) {
    const gainNode = context[INTERNAL_AUDIO_CONTEXT].createGain()

    super({ context, inputs: [gainNode], outputs: [gainNode] })

    this.#gainNode = gainNode
    this.#gain = new AudioSynthParam(gainNode.gain, {
      context,
      unit: 'normal',
      initialValue: Unit.normal.min,
    })

    this.attack = new ScalarSynthParam({
      context,
      unit: 'beats',
      initialValue: Unit.beats.orThrow(0),
      range: Range.positive,
    })

    this.decay = new ScalarSynthParam({
      context,
      unit: 'beats',
      initialValue: Unit.beats.orThrow(0),
      range: Range.positive,
    })

    this.sustain = new ScalarSynthParam({
      context,
      unit: 'normal',
      initialValue: Unit.normal.max,
    })

    this.release = new ScalarSynthParam({
      context,
      unit: 'beats',
      initialValue: Unit.beats.orThrow(0),
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
    gain.rampValueUntil(attackEnd, Unit.normal.max, 'linear')

    if (decayDuration > 0) {
      gain.rampValueUntil(decayEnd, sustainLevel, 'linear')
    } else {
      gain.setValueAt(decayEnd, attackDuration > 0 ? Unit.normal.max : sustainLevel)
    }
  }

  releaseAt(start: SynthTime) {
    const gain = this.#gain.curve

    gain.holdValueAt(start)

    const releaseDuration = this.release.curve.valueAt(start)
    const releaseEnd = start.add({ beat: releaseDuration })

    if (releaseDuration > 0) {
      gain.rampValueUntil(releaseEnd, Unit.normal.min)
    } else {
      // TODO: maybe a better solution
      gain.setValueAt(releaseEnd.add({ beat: Number.EPSILON }), Unit.normal.min)
    }
  }

  override dispose(): void {
    super.dispose()
    this.#gainNode.disconnect()
  }
}

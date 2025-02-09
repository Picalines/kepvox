import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { ScalarSynthParam } from '#param'
import type { SynthTime } from '#time'
import { Normal, Notes } from '#units'
import { SYNTH_NODE_TYPE, SynthNode } from './synth-node'

export class ADSREnvelopeSynthNode extends SynthNode {
  readonly [SYNTH_NODE_TYPE] = 'adsr-envelope'

  readonly attack
  readonly decay
  readonly sustain
  readonly release

  readonly #gain

  constructor(context: SynthContext) {
    const gainNode = context[INTERNAL_AUDIO_CONTEXT].createGain()

    super({ context, inputs: [gainNode], outputs: [gainNode] })

    this.#gain = new ScalarSynthParam({
      node: this,
      audioParam: gainNode.gain,
      unit: 'normal',
      initialValue: Normal.min,
    })

    this.attack = new ScalarSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
    })

    this.decay = new ScalarSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
    })

    this.sustain = new ScalarSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.max,
    })

    this.release = new ScalarSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
    })
  }

  attackAt(start: SynthTime) {
    const attackDuration = this.attack.curve.valueAt(start)
    const attackEnd = start.add({ note: attackDuration })

    const decayDuration = this.decay.curve.valueAt(attackEnd)
    const decayEnd = attackEnd.add({ note: decayDuration })

    const sustainLevel = this.sustain.curve.valueAt(decayEnd)

    const gain = this.#gain.curve
    gain.holdValueAt(start)

    const attackValue = decayDuration > 0 ? Normal.max : sustainLevel

    if (attackDuration > 0) {
      gain.rampValueUntil(attackEnd, attackValue, 'linear')
    } else {
      gain.setValueAt(attackEnd, attackValue)
    }

    if (decayDuration > 0) {
      gain.rampValueUntil(decayEnd, sustainLevel, 'linear')
    } else {
      gain.setValueAt(decayEnd, sustainLevel)
    }
  }

  releaseAt(start: SynthTime) {
    const releaseDuration = this.release.curve.valueAt(start)
    const releaseEnd = start.add({ note: releaseDuration })

    const gain = this.#gain.curve
    gain.holdValueAt(start)

    if (releaseDuration > 0) {
      gain.rampValueUntil(releaseEnd, Normal.min)
    } else {
      gain.setValueAt(releaseEnd, Normal.min)
    }
  }
}

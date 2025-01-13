import { Range } from '@repo/common/math'
import type { SynthContext, SynthTimeLike } from '#context'
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
    const { audioContext } = context

    const gainNode = audioContext.createGain()

    super({ context, inputs: [gainNode], outputs: [gainNode] })

    this.#gainNode = gainNode
    this.#gain = new AudioSynthParam(gainNode.gain, {
      context,
      unit: 'factor',
      initialValue: 0,
    })

    this.attack = new ScalarSynthParam({
      context,
      unit: 'seconds',
      initialValue: 0,
      range: Range.positive,
    })

    this.decay = new ScalarSynthParam({
      context,
      unit: 'seconds',
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
      unit: 'seconds',
      initialValue: 0,
      range: Range.positive,
    })
  }

  attackAt(start: SynthTimeLike) {
    const startTime = this.context.time(start)

    this.#gain.cancelAfter(startTime)
    this.#gain.setAt(startTime, 0)

    const attackDuration = this.attack.getAt(startTime)
    const attackEnd = this.context.time(startTime + attackDuration)

    const decayDuration = this.decay.getAt(attackEnd)
    const decayEnd = this.context.time(attackEnd + decayDuration)

    const sustainLevel = this.sustain.getAt(decayEnd)

    if (attackDuration > 0) {
      this.#gain.setAt(startTime, 0)
      this.#gain.rampUntil(attackEnd, 1, 'linear')
    }

    if (decayDuration > 0) {
      this.#gain.rampUntil(decayEnd, sustainLevel, 'linear')
    } else {
      this.#gain.setAt(decayEnd, attackDuration > 0 ? 1 : sustainLevel)
    }
  }

  releaseAt(start: SynthTimeLike) {
    const startTime = this.context.time(start)

    this.#gain.holdAt(startTime)

    const releaseDuration = this.release.getAt(startTime)
    const releaseEnd = this.context.time(startTime + releaseDuration)

    if (releaseDuration > 0) {
      this.#gain.rampUntil(releaseEnd, 0)
    } else {
      this.#gain.setAt(releaseEnd, 0)
    }
  }

  override dispose(): void {
    super.dispose()
    this.#gainNode.disconnect()
    this.#gain.cancelAfter(this.context.time(0))
  }
}

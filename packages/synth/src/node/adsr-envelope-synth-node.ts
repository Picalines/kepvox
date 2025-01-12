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
      unit: 'seconds',
      initialValue: 0,
      range: Range.positive,
    })

    this.decay = new ScalarSynthParam({
      unit: 'seconds',
      initialValue: 0,
      range: Range.positive,
    })

    this.sustain = new ScalarSynthParam({
      unit: 'normalRange',
      initialValue: 1,
    })

    this.release = new ScalarSynthParam({
      unit: 'seconds',
      initialValue: 0,
      range: Range.positive,
    })
  }

  attackAt(start: SynthTimeLike) {
    const startTime = this.context.time(start)

    this.#gain.cancelAfter(startTime)

    // TODO(#8): replace getImmediate with getAt or something
    const attackDuration = this.attack.getImmediate()
    const decayDuration = this.decay.getImmediate()
    const sustainLevel = this.sustain.getImmediate()

    const attackEnd = this.context.time(startTime + attackDuration)
    const decayEnd = this.context.time(attackEnd + decayDuration)

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

    // TODO(#8): replace getImmediate with getAt or something
    const releaseDuration = this.release.getImmediate()
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

import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT } from '#internal-symbols'
import { Range } from '#math'
import { CurveSynthParam } from '#param'
import type { SynthTime } from '#time'
import { Normal, Notes, Seconds } from '#units'
import { SynthNode } from '../synth-node'

const MAX_DELAY = Seconds.orThrow(60)

export class DelaySynthNode extends SynthNode {
  readonly delayLeft: CurveSynthParam<'notes'>
  readonly delayRight: CurveSynthParam<'notes'>

  readonly dry: CurveSynthParam<'normal'>
  readonly wetLeft: CurveSynthParam<'normal'>
  readonly wetRight: CurveSynthParam<'normal'>

  constructor(context: SynthContext) {
    const audioContext = context[INTERNAL_AUDIO_CONTEXT]

    const input = audioContext.createGain()
    const output = audioContext.createGain()

    const dryGain = audioContext.createGain()
    const splitter = audioContext.createChannelSplitter(2)
    const merger = audioContext.createChannelMerger(2)

    const delayLeft = audioContext.createDelay(MAX_DELAY)
    const gainLeft = audioContext.createGain()

    const delayRight = audioContext.createDelay(MAX_DELAY)
    const gainRight = audioContext.createGain()

    input.connect(splitter)
    input.connect(dryGain).connect(output)

    splitter.connect(delayLeft, 0).connect(gainLeft).connect(merger, 0, 0)
    splitter.connect(delayRight, 1).connect(gainRight).connect(merger, 0, 1)

    merger.connect(output)

    super({ context, inputs: [input], outputs: [output] })

    const mapNotesToSeconds = (notes: Notes, time: SynthTime) => context.secondsPerNote.valueAt(time) * notes

    this.delayLeft = new CurveSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
      automate: { param: delayLeft.delayTime, map: mapNotesToSeconds },
    })

    this.delayRight = new CurveSynthParam({
      node: this,
      unit: 'notes',
      initialValue: Notes.orThrow(0),
      range: Range.positive,
      automate: { param: delayRight.delayTime, map: mapNotesToSeconds },
    })

    this.dry = new CurveSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.orThrow(0),
      automate: { param: dryGain.gain },
    })

    this.wetLeft = new CurveSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.orThrow(1),
      automate: { param: gainLeft.gain },
    })

    this.wetRight = new CurveSynthParam({
      node: this,
      unit: 'normal',
      initialValue: Normal.orThrow(1),
      automate: { param: gainRight.gain },
    })
  }
}

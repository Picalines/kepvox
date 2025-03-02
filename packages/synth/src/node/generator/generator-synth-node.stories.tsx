import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import type { SynthContext } from '#context'
import { Pitch } from '#pitch'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
import { Factor, Normal, Notes, Seconds } from '#units'
import { GainSynthNode } from '../gain'
import type { SynthNode } from '../synth-node'
import { GeneratorSynthNode, type GeneratorWaveShape } from './generator-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Generator',
  component: WaveformStory,
  args: {
    duration: Seconds.orThrow(1),
    numberOfChannels: 1,
    waveformDetails: 0.1,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

type CreateGeneratorParams = {
  context: SynthContext
  attack?: Notes
  decay?: Notes
  sustain?: Normal
  release?: Notes
  waveShape?: GeneratorWaveShape
  destination?: SynthNode
}

const createGenerator = (params: CreateGeneratorParams) => {
  const { context, attack, decay, sustain, release, waveShape, destination } = params

  const generator = new GeneratorSynthNode(context)
  generator.connect(destination ?? context.output)

  generator.attack.initialValue = attack ?? generator.attack.initialValue
  generator.decay.initialValue = decay ?? generator.decay.initialValue
  generator.sustain.initialValue = sustain ?? generator.sustain.initialValue
  generator.release.initialValue = release ?? generator.release.initialValue
  generator.waveShape.value = waveShape ?? generator.waveShape.value

  return generator
}

export const Default: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 4))

      const generator = createGenerator({
        context,
        attack: Notes.orThrow(1),
        decay: Notes.orThrow(1),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(1),
        waveShape: 'triangle',
      })

      generator.attackAt(SynthTime.start, Pitch.frequency('C1'))
      generator.releaseAt(SynthTime.note.repeat(3), Pitch.frequency('C1'))
    },
  },
}

export const Polyphony: Story = {
  args: {
    timeMarkers: [SynthTime.note.repeat(3), SynthTime.note.repeat(4)],
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 6))

      const gain = new GainSynthNode(context)
      gain.factor.initialValue = Factor.orThrow(1)
      gain.connect(context.output)

      const generator = createGenerator({
        context,
        attack: Notes.orThrow(1),
        decay: Notes.orThrow(1),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(1),
        waveShape: 'sine',
        destination: gain,
      })

      generator.attackAt(SynthTime.start, Pitch.frequency('C1'))
      generator.releaseAt(SynthTime.note.repeat(3), Pitch.frequency('C1'))

      generator.attackAt(SynthTime.note.repeat(3), Pitch.frequency('A5'))
    },
  },
}

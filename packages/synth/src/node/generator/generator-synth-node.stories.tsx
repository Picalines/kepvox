import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { Pitch } from '#pitch'
import type { Synth } from '#synth'
import { WaveformStory } from '#test'
import { Time } from '#time'
import { Factor, Normal, Notes, Seconds } from '#units'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { GainSynthNode } from '../gain'
import type { SynthNode } from '../synth-node'
import { GeneratorSynthNode, type GeneratorWaveShape } from './generator-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Generator',
  component: WaveformStory,
  args: {
    duration: Seconds(1),
    numberOfChannels: 1,
    waveformDetails: 0.1,
    maxAmplitude: DEFAULT_SOURCE_GAIN,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

type CreateGeneratorParams = {
  synth: Synth
  attack?: Notes
  decay?: Notes
  sustain?: Normal
  release?: Notes
  waveShape?: GeneratorWaveShape
  destination?: SynthNode
}

const createGenerator = (params: CreateGeneratorParams) => {
  const { synth, attack, decay, sustain, release, waveShape, destination } = params

  const generator = new GeneratorSynthNode(synth)
  generator.connect(destination ?? synth.output)

  generator.attack.initialValue = attack ?? generator.attack.initialValue
  generator.decay.initialValue = decay ?? generator.decay.initialValue
  generator.sustain.initialValue = sustain ?? generator.sustain.initialValue
  generator.release.initialValue = release ?? generator.release.initialValue
  generator.waveShape.value = waveShape ?? generator.waveShape.value

  return generator
}

export const Default: Story = {
  args: {
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 4))

      const generator = createGenerator({
        synth,
        attack: Notes(1),
        decay: Notes(1),
        sustain: Normal(0.5),
        release: Notes(1),
        waveShape: 'triangle',
      })

      generator.attackAt(Time.start, Pitch.c1.hertz)
      generator.releaseAt(Time.n1.repeat(3), Pitch.c1.hertz)
    },
  },
}

export const Polyphony: Story = {
  args: {
    timeMarkers: [Time.n1.repeat(3), Time.n1.repeat(4)],
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 6))

      const gain = new GainSynthNode(synth)
      gain.factor.initialValue = Factor(1)
      gain.connect(synth.output)

      const generator = createGenerator({
        synth,
        attack: Notes(1),
        decay: Notes(1),
        sustain: Normal(0.5),
        release: Notes(1),
        waveShape: 'sine',
        destination: gain,
      })

      generator.attackAt(Time.start, Pitch.c1.hertz)
      generator.releaseAt(Time.n1.repeat(3), Pitch.c1.hertz)

      generator.attackAt(Time.n1.repeat(3), Pitch.a5.hertz)
    },
  },
}

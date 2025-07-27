import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { Time } from '#time'
import { Factor, Hertz, Normal, Seconds } from '#units'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { GainSynthNode } from '../gain'
import { OscillatorSynthNode } from '../oscillator'
import { DelaySynthNode } from './delay-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Delay',
  component: WaveformStory,
  args: {
    duration: Seconds(1),
    numberOfChannels: 2,
    waveformDetails: 0.1,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    maxAmplitude: DEFAULT_SOURCE_GAIN,
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1))

      const oscillator = new OscillatorSynthNode(synth)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz(2)

      const delay = new DelaySynthNode(synth)
      delay.delayRight.initialValue = Time.quarter.toNotes()

      oscillator.connect(delay)
      delay.connect(synth.output)
    },
  },
}

export const WithOriginal: Story = {
  args: {
    maxAmplitude: DEFAULT_SOURCE_GAIN,
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1))

      const oscillator = new OscillatorSynthNode(synth)
      oscillator.waveShape.value = 'sine'
      oscillator.frequency.initialValue = Hertz(4)

      const delay = new DelaySynthNode(synth)
      delay.dry.initialValue = Normal(1)
      delay.wetLeft.initialValue = Normal(0.5)
      delay.wetRight.initialValue = Normal(0.5)
      delay.delayLeft.initialValue = Time.quarter.toNotes()
      delay.delayRight.initialValue = Time.half.toNotes()

      const gain = new GainSynthNode(synth)
      gain.factor.initialValue = Factor(0.5)

      oscillator.connect(delay)
      delay.connect(gain)
      gain.connect(synth.output)
    },
  },
}

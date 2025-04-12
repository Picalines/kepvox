import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
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
    duration: Seconds.orThrow(1),
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
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1))

      const oscillator = new OscillatorSynthNode(context)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz.orThrow(2)

      const delay = new DelaySynthNode(context)
      delay.delayRight.initialValue = SynthTime.quarter.toNotes()

      oscillator.connect(delay)
      delay.connect(context.output)
    },
  },
}

export const WithOriginal: Story = {
  args: {
    maxAmplitude: DEFAULT_SOURCE_GAIN,
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1))

      const oscillator = new OscillatorSynthNode(context)
      oscillator.waveShape.value = 'sine'
      oscillator.frequency.initialValue = Hertz.orThrow(4)

      const delay = new DelaySynthNode(context)
      delay.dry.initialValue = Normal.orThrow(1)
      delay.wetLeft.initialValue = Normal.orThrow(0.5)
      delay.wetRight.initialValue = Normal.orThrow(0.5)
      delay.delayLeft.initialValue = SynthTime.quarter.toNotes()
      delay.delayRight.initialValue = SynthTime.half.toNotes()

      const gain = new GainSynthNode(context)
      gain.factor.initialValue = Factor.orThrow(0.5)

      oscillator.connect(delay)
      delay.connect(gain)
      gain.connect(context.output)
    },
  },
}

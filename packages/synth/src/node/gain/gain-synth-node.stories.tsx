import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { Pitch } from '#pitch'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
import { Factor, Seconds } from '#units'
import { OscillatorSynthNode } from '../oscillator'
import { GainSynthNode } from './gain-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Gain',
  component: WaveformStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    duration: Seconds.orThrow(1),
    numberOfChannels: 2,
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1))

      const oscillator = new OscillatorSynthNode(context)
      oscillator.frequency.initialValue = Pitch.frequency('C2')

      const gain = new GainSynthNode(context)
      gain.factor.initialValue = Factor.orThrow(0)
      gain.factor.curve.rampValueUntil(SynthTime.note, Factor.orThrow(1))

      oscillator.connectOutput(gain)
      gain.connectOutput(context.output)
    },
  },
}

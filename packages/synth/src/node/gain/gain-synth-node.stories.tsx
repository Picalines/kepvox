import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { Time } from '#time'
import { Decibels, Factor, Seconds } from '#units'
import { ConstantSynthNode } from '../constant'
import { GainSynthNode } from './gain-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Gain',
  component: WaveformStory,
  args: {
    numberOfChannels: 1,
    duration: Seconds(1),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const HalfFactor: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(Time.start, Seconds(1))

      const constant = new ConstantSynthNode(context)
      constant.value.initialValue = Factor(1)

      const gain = new GainSynthNode(context)
      gain.factor.initialValue = Factor(0.5)

      constant.connect(gain)
      gain.connect(context.output)
    },
  },
}

export const Decibel: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(Time.start, Seconds(1))

      const constant = new ConstantSynthNode(context)
      constant.value.initialValue = Factor(1)

      const gain = new GainSynthNode(context)
      gain.decibels.initialValue = Decibels(0)
      gain.decibels.curve.rampValueUntil(Time.note, Decibels.orThrow(-30), 'exponential')

      constant.connect(gain)
      gain.connect(context.output)
    },
  },
}

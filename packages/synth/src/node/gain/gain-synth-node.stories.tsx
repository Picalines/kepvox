import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
import { Decibels, Factor, Seconds } from '#units'
import { ConstantSynthNode } from '../constant'
import { GainSynthNode } from './gain-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Gain',
  component: WaveformStory,
  args: {
    numberOfChannels: 1,
    duration: Seconds.orThrow(1),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const HalfFactor: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1))

      const constant = new ConstantSynthNode(context)
      constant.value.initialValue = Factor.orThrow(1)

      const gain = new GainSynthNode(context)
      gain.factor.initialValue = Factor.orThrow(0.5)

      constant.connectOutput(gain)
      gain.connectOutput(context.output)
    },
  },
}

export const Decibel: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1))

      const constant = new ConstantSynthNode(context)
      constant.value.initialValue = Factor.orThrow(1)

      const gain = new GainSynthNode(context)
      gain.decibels.initialValue = Decibels.orThrow(0)
      gain.decibels.curve.rampValueUntil(SynthTime.note, Decibels.orThrow(-30), 'exponential')

      constant.connectOutput(gain)
      gain.connectOutput(context.output)
    },
  },
}

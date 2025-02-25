import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
import { Factor, Seconds } from '#units'
import { ConstantSynthNode } from './constant-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Constant',
  component: WaveformStory,
  args: {
    duration: Seconds.orThrow(1),
    numberOfChannels: 1,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    synthTree: context => {
      const constant = new ConstantSynthNode(context)
      constant.connectOutput(context.output)
      constant.value.initialValue = Factor.orThrow(1)
    },
  },
}

export const Half: Story = {
  args: {
    synthTree: context => {
      const constant = new ConstantSynthNode(context)
      constant.connectOutput(context.output)
      constant.value.initialValue = Factor.orThrow(0.5)
    },
  },
}

export const LinearRamp: Story = {
  args: {
    duration: Seconds.orThrow(1),
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1))
      const constant = new ConstantSynthNode(context)
      constant.connectOutput(context.output)
      constant.value.initialValue = Factor.orThrow(0)
      constant.value.curve.rampValueUntil(SynthTime.note, Factor.orThrow(1))
    },
  },
}

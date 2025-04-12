import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
import { Factor, Hertz, Seconds } from '#units'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { GainSynthNode } from '../gain'
import { OscillatorSynthNode } from './oscillator-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Oscillator',
  component: WaveformStory,
  args: {
    duration: Seconds.orThrow(1),
    numberOfChannels: 1,
    waveformDetails: 0.1,
    maxAmplitude: DEFAULT_SOURCE_GAIN,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    synthTree: context => {
      const oscillator = new OscillatorSynthNode(context)
      oscillator.connect(context.output)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz.orThrow(440)
    },
  },
}

export const Triangle: Story = {
  args: {
    synthTree: context => {
      const oscillator = new OscillatorSynthNode(context)
      oscillator.connect(context.output)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz.orThrow(4)
    },
  },
}

export const Sine: Story = {
  args: {
    synthTree: context => {
      const oscillator = new OscillatorSynthNode(context)
      oscillator.connect(context.output)
      oscillator.waveShape.value = 'sine'
      oscillator.frequency.initialValue = Hertz.orThrow(2)
    },
  },
}

export const Sawtooth: Story = {
  args: {
    synthTree: context => {
      const oscillator = new OscillatorSynthNode(context)
      oscillator.connect(context.output)
      oscillator.waveShape.value = 'sawtooth'
      oscillator.frequency.initialValue = Hertz.orThrow(4)
    },
  },
}

export const Square: Story = {
  args: {
    synthTree: context => {
      const oscillator = new OscillatorSynthNode(context)
      oscillator.connect(context.output)
      oscillator.waveShape.value = 'square'
      oscillator.frequency.initialValue = Hertz.orThrow(4)
    },
  },
}

export const Limited: Story = {
  args: {
    synthTree: context => {
      const oscillator = new OscillatorSynthNode(context)
      const gain = new GainSynthNode(context)
      oscillator.connect(gain)
      gain.connect(context.output)

      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz.orThrow(4)

      gain.factor.initialValue = Factor.orThrow(0)
      gain.factor.curve.rampValueUntil(SynthTime.half, Factor.orThrow(1))
    },
  },
}

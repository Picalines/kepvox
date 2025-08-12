import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { Time } from '#time'
import { Factor, Hertz, Seconds } from '#units'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { GainSynthNode } from '../gain'
import { OscillatorSynthNode } from './oscillator-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Oscillator',
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

export const Default: Story = {
  args: {
    synthTree: synth => {
      const oscillator = new OscillatorSynthNode(synth)
      oscillator.connect(synth.output)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz(440)
    },
  },
}

export const Triangle: Story = {
  args: {
    synthTree: synth => {
      const oscillator = new OscillatorSynthNode(synth)
      oscillator.connect(synth.output)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz(4)
    },
  },
}

export const Sine: Story = {
  args: {
    synthTree: synth => {
      const oscillator = new OscillatorSynthNode(synth)
      oscillator.connect(synth.output)
      oscillator.waveShape.value = 'sine'
      oscillator.frequency.initialValue = Hertz(2)
    },
  },
}

export const Sawtooth: Story = {
  args: {
    synthTree: synth => {
      const oscillator = new OscillatorSynthNode(synth)
      oscillator.connect(synth.output)
      oscillator.waveShape.value = 'sawtooth'
      oscillator.frequency.initialValue = Hertz(4)
    },
  },
}

export const Square: Story = {
  args: {
    synthTree: synth => {
      const oscillator = new OscillatorSynthNode(synth)
      oscillator.connect(synth.output)
      oscillator.waveShape.value = 'square'
      oscillator.frequency.initialValue = Hertz(4)
    },
  },
}

export const Limited: Story = {
  args: {
    synthTree: synth => {
      const oscillator = new OscillatorSynthNode(synth)
      const gain = new GainSynthNode(synth)
      oscillator.connect(gain)
      gain.connect(synth.output)

      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz(4)

      gain.factor.initialValue = Factor(0)
      gain.factor.curve.rampValueUntil(Time.n2, Factor(1))
    },
  },
}

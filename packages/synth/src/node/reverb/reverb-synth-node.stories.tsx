import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
import { Factor, Hertz, Normal, Seconds } from '#units'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { GainSynthNode } from '../gain'
import { OscillatorSynthNode } from '../oscillator'
import { ReverbSynthNode } from './reverb-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/Reverb',
  component: WaveformStory,
  args: {
    numberOfChannels: 2,
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
    duration: Seconds.orThrow(4.5),
    timeMarkers: [SynthTime.quarter, SynthTime.note],
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(4))

      const oscillator = new OscillatorSynthNode(context)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz.orThrow(8)

      const gate = new GainSynthNode(context)
      gate.factor.initialValue = Factor.orThrow(0.8)
      gate.factor.curve.setValueAt(SynthTime.quarter, Factor.orThrow(0))

      const reverb = new ReverbSynthNode(context)
      reverb.decay.value = Factor.orThrow(1)
      reverb.duration.value = Seconds.orThrow(3)

      oscillator.connect(gate)
      gate.connect(reverb)
      reverb.connect(context.output)
    },
  },
}

export const Wet: Story = {
  args: {
    duration: Seconds.orThrow(4.5),
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(4))

      const oscillator = new OscillatorSynthNode(context)
      oscillator.waveShape.value = 'triangle'
      oscillator.frequency.initialValue = Hertz.orThrow(1)

      const reverb = new ReverbSynthNode(context)
      reverb.dry.initialValue = Normal.min
      reverb.duration.value = Seconds.orThrow(1)

      oscillator.connect(reverb)
      reverb.connect(context.output)
    },
  },
}

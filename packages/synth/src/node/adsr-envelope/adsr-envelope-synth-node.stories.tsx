import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import type { Synth } from '#synth'
import { WaveformStory } from '#test'
import { Time } from '#time'
import { Normal, Notes, Seconds } from '#units'
import { ConstantSynthNode } from '../constant'
import { DEFAULT_SOURCE_GAIN } from '../constants'
import { OscillatorSynthNode } from '../oscillator'
import type { SynthNode } from '../synth-node'
import { ADSREnvelopeSynthNode } from './adsr-envelope-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/ADSREnvelope',
  component: WaveformStory,
  args: {
    duration: Seconds(1),
    numberOfChannels: 1,
    waveformDetails: 0.1,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

type CreateEnvelopeParams = {
  synth: Synth
  attack?: Notes
  decay?: Notes
  sustain?: Normal
  release?: Notes
  source?: SynthNode
}

const createEnvelope = (params: CreateEnvelopeParams) => {
  const { synth, attack, decay, sustain, release, source: sourceParam } = params

  const envelope = new ADSREnvelopeSynthNode(synth)
  envelope.connect(synth.output)

  const source = sourceParam ?? new ConstantSynthNode(synth)
  source.connect(envelope)

  envelope.attack.initialValue = attack ?? envelope.attack.initialValue
  envelope.decay.initialValue = decay ?? envelope.decay.initialValue
  envelope.sustain.initialValue = sustain ?? envelope.sustain.initialValue
  envelope.release.initialValue = release ?? envelope.release.initialValue

  return envelope
}

export const Default: Story = {
  args: {
    timeMarkers: [Time.n1, Time.n1.repeat(2), Time.n1.repeat(3)],
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 4))

      const envelope = createEnvelope({
        synth,
        attack: Notes(1),
        decay: Notes(1),
        sustain: Normal(0.5),
        release: Notes(1),
      })

      envelope.attackAt(Time.start)
      envelope.releaseAt(Time.n1.repeat(3))
    },
  },
}

export const Chained: Story = {
  args: {
    timeMarkers: [Time.n1.repeat(3)],
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 8))

      const envelope = createEnvelope({
        synth,
        attack: Notes(1),
        decay: Notes(1),
        sustain: Normal(0.5),
        release: Notes(1),
      })

      envelope.attackAt(Time.start)
      envelope.releaseAt(Time.n1.repeat(3))
      envelope.attackAt(Time.n1.repeat(3))
      envelope.releaseAt(Time.n1.repeat(7))
    },
  },
}

export const Oscillator: Story = {
  args: {
    timeMarkers: [Time.n1, Time.n1.repeat(2), Time.n1.repeat(3)],
    maxAmplitude: DEFAULT_SOURCE_GAIN,
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 4))

      const envelope = createEnvelope({
        synth,
        attack: Notes(1),
        decay: Notes(1),
        sustain: Normal(0.5),
        release: Notes(1),
        source: new OscillatorSynthNode(synth),
      })

      envelope.attackAt(Time.start)
      envelope.releaseAt(Time.n1.repeat(3))
    },
  },
}

export const NoAttack: Story = {
  args: {
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 4))

      const envelope = createEnvelope({
        synth,
        attack: Notes(0),
        decay: Notes(1),
        sustain: Normal(0.5),
        release: Notes(1),
      })

      envelope.attackAt(Time.start)
      envelope.releaseAt(Time.n1.repeat(3))
    },
  },
}

export const NoDecay: Story = {
  args: {
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 4))

      const envelope = createEnvelope({
        synth,
        attack: Notes(1),
        decay: Notes(0),
        sustain: Normal(0.5),
        release: Notes(1),
      })

      envelope.attackAt(Time.start)
      envelope.releaseAt(Time.n1.repeat(3))
    },
  },
}

export const NoRelease: Story = {
  args: {
    synthTree: synth => {
      synth.secondsPerNote.setValueAt(Time.start, Seconds(1 / 4))

      const envelope = createEnvelope({
        synth,
        attack: Notes(1),
        decay: Notes(1),
        sustain: Normal(0.5),
        release: Notes(0),
      })

      envelope.attackAt(Time.start)
      envelope.releaseAt(Time.n1.repeat(3))
    },
  },
}

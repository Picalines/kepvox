import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import type { SynthContext } from '#context'
import { WaveformStory } from '#test'
import { SynthTime } from '#time'
import { Normal, Notes, Seconds } from '#units'
import { ConstantSynthNode } from '../constant'
import { OscillatorSynthNode } from '../oscillator'
import type { SynthNode } from '../synth-node'
import { ADSREnvelopeSynthNode } from './adsr-envelope-synth-node'

type StoryArgs = ComponentProps<typeof WaveformStory>

export default {
  title: 'nodes/ADSREnvelope',
  component: WaveformStory,
  args: {
    duration: Seconds.orThrow(1),
    numberOfChannels: 1,
    waveformDetails: 0.1,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

type CreateEnvelopeParams = {
  context: SynthContext
  attack?: Notes
  decay?: Notes
  sustain?: Normal
  release?: Notes
  source?: SynthNode
}

const createEnvelope = (params: CreateEnvelopeParams) => {
  const { context, attack, decay, sustain, release, source: sourceParam } = params

  const envelope = new ADSREnvelopeSynthNode(context)
  envelope.connect(context.output)

  const source = sourceParam ?? new ConstantSynthNode(context)
  source.connect(envelope)

  envelope.attack.initialValue = attack ?? envelope.attack.initialValue
  envelope.decay.initialValue = decay ?? envelope.decay.initialValue
  envelope.sustain.initialValue = sustain ?? envelope.sustain.initialValue
  envelope.release.initialValue = release ?? envelope.release.initialValue

  return envelope
}

export const Default: Story = {
  args: {
    timeMarkers: [SynthTime.note, SynthTime.note.repeat(2), SynthTime.note.repeat(3)],
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 4))

      const envelope = createEnvelope({
        context,
        attack: Notes.orThrow(1),
        decay: Notes.orThrow(1),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(1),
      })

      envelope.attackAt(SynthTime.start)
      envelope.releaseAt(SynthTime.note.repeat(3))
    },
  },
}

export const Chained: Story = {
  args: {
    timeMarkers: [SynthTime.note.repeat(3)],
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 8))

      const envelope = createEnvelope({
        context,
        attack: Notes.orThrow(1),
        decay: Notes.orThrow(1),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(1),
      })

      envelope.attackAt(SynthTime.start)
      envelope.releaseAt(SynthTime.note.repeat(3))
      envelope.attackAt(SynthTime.note.repeat(3))
      envelope.releaseAt(SynthTime.note.repeat(7))
    },
  },
}

export const Oscillator: Story = {
  args: {
    timeMarkers: [SynthTime.note, SynthTime.note.repeat(2), SynthTime.note.repeat(3)],
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 4))

      const envelope = createEnvelope({
        context,
        attack: Notes.orThrow(1),
        decay: Notes.orThrow(1),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(1),
        source: new OscillatorSynthNode(context),
      })

      envelope.attackAt(SynthTime.start)
      envelope.releaseAt(SynthTime.note.repeat(3))
    },
  },
}

export const NoAttack: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 4))

      const envelope = createEnvelope({
        context,
        attack: Notes.orThrow(0),
        decay: Notes.orThrow(1),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(1),
      })

      envelope.attackAt(SynthTime.start)
      envelope.releaseAt(SynthTime.note.repeat(3))
    },
  },
}

export const NoDecay: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 4))

      const envelope = createEnvelope({
        context,
        attack: Notes.orThrow(1),
        decay: Notes.orThrow(0),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(1),
      })

      envelope.attackAt(SynthTime.start)
      envelope.releaseAt(SynthTime.note.repeat(3))
    },
  },
}

export const NoRelease: Story = {
  args: {
    synthTree: context => {
      context.secondsPerNote.setValueAt(SynthTime.start, Seconds.orThrow(1 / 4))

      const envelope = createEnvelope({
        context,
        attack: Notes.orThrow(1),
        decay: Notes.orThrow(1),
        sustain: Normal.orThrow(0.5),
        release: Notes.orThrow(0),
      })

      envelope.attackAt(SynthTime.start)
      envelope.releaseAt(SynthTime.note.repeat(3))
    },
  },
}

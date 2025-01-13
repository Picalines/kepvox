'use client'

import { waitUntil } from '@repo/common/promise'
import { ADSREnvelopeSynthNode, OscillatorSynthNode, OutputSynthNode, SynthContext } from '@repo/synth'
import { Button } from '@repo/ui-kit/components/button'
import { PlayIcon } from '@repo/ui-kit/icons'

export const PlaybackButton = () => {
  const onClick = async () => {
    const audioContext = new AudioContext()
    await audioContext.resume()

    const context = new SynthContext(audioContext)

    const oscillator = new OscillatorSynthNode(context)
    const envelope = new ADSREnvelopeSynthNode(context)
    const output = OutputSynthNode.ofContext(context)

    oscillator.connectOutput(envelope)
    envelope.connectOutput(output)

    await waitUntil(100, () => audioContext.state === 'running')

    // biome-ignore lint/suspicious/noConsoleLog: temporary
    console.log('running!')

    oscillator.frequency.setImmediate(440)
    oscillator.waveShape.setImmediate('sawtooth')
    envelope.attack.setImmediate(0.02)
    envelope.decay.setImmediate(0.1)
    envelope.sustain.setImmediate(0.5)
    envelope.release.setImmediate(0.5)

    envelope.attackAt({ from: 'ahead' })
    envelope.releaseAt({ from: 'ahead', note: 8 })
    oscillator.frequency.rampUntil({ from: 'ahead', note: 8 }, 880)

    // @ts-expect-error
    window.e = envelope
    // @ts-expect-error
    window.o = oscillator
  }

  return (
    <Button onClick={onClick} size="md" shape="square" variant="secondary" className="relative">
      <PlayIcon className="absolute" />
    </Button>
  )
}

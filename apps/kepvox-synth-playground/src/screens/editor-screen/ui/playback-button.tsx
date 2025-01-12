'use client'

import { waitUntil } from '@repo/common/promise'
import { ADSREnvelopeSynthNode, OscillatorSynthNode, OutputSynthNode, SynthContext } from '@repo/synth'
import { Button } from '@repo/ui-kit/components/button'
import { PlayIcon } from '@repo/ui-kit/icons'

export const PlaybackButton = () => {
  const onClick = async () => {
    const audioContext = new AudioContext()
    await audioContext.resume()

    const synthContext = new SynthContext(audioContext)

    const oscillator = new OscillatorSynthNode(synthContext)
    const envelope = new ADSREnvelopeSynthNode(synthContext)
    const output = OutputSynthNode.ofContext(synthContext)

    oscillator.connectOutput(envelope)
    envelope.connectOutput(output)

    await waitUntil(100, () => audioContext.state === 'running')

    // biome-ignore lint/suspicious/noConsoleLog: temporary
    console.log('running!')

    oscillator.frequency.setImmediate(880)
    oscillator.waveShape.setImmediate('sawtooth')
    envelope.attack.setImmediate(0.1)
    envelope.release.setImmediate(0.5)

    // @ts-expect-error
    window.e = envelope
    // @ts-expect-error
    window.o = oscillator

    envelope.attackAt({ fromAhead: true })
    envelope.releaseAt({ fromAhead: true, seconds: 0.2 })
  }

  return (
    <Button onClick={onClick} size="md" shape="square" variant="secondary" className="relative">
      <PlayIcon className="absolute" />
    </Button>
  )
}

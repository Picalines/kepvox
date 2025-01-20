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

    oscillator.frequency.initialValue = 440
    oscillator.waveShape.value = 'sawtooth'
    envelope.attack.initialValue = 1
    envelope.decay.initialValue = 1
    envelope.sustain.initialValue = 0.5
    envelope.release.initialValue = 1

    let time = context.firstBeat
    for (let i = 0; i < 5; i++) {
      envelope.attackAt(time)
      time = time.add({ note: 1 })
      envelope.releaseAt(time)
      time = time.add({ beat: 1 })
      oscillator.frequency.curve.rampValueUntil(time, 440 + 40 * i)
      context.secondsPerBeat.rampValueUntil(time, 1 / (i + 1))
    }

    context.play()

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

'use client'

import { OscillatorSynthNode, OutputSynthNode, SynthContext } from '@repo/synth'
import { Button } from '@repo/ui-kit/components/button'
import { PlayIcon } from '@repo/ui-kit/icons'

export const PlaybackButton = () => {
  const onClick = async () => {
    const audioContext = new AudioContext()
    await audioContext.resume()

    const synthContext = new SynthContext(audioContext)

    const oscillator = new OscillatorSynthNode(synthContext)
    const output = OutputSynthNode.ofContext(synthContext)
    oscillator.connectOutput(output)

    // @ts-expect-error
    window.o = oscillator
  }

  return (
    <Button onClick={onClick} size="md" shape="square" variant="secondary" className="relative">
      <PlayIcon className="absolute" />
    </Button>
  )
}

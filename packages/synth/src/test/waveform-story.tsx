import { drawWaveform } from '@repo/web-audio/draw'
import { resample } from '@repo/web-audio/math'
import { renderAudioOffline } from '@repo/web-audio/offline'
import { useCallback, useEffect, useRef } from 'react'
import { SynthContext } from '#context'
import { Seconds } from '#units'

type Props<T> = {
  synthTree: (synthContext: SynthContext, props: T) => void
  props: T
  duration: Seconds
  numberOfChannels?: number
  sampleRate?: number
  waveformDetails?: number
  canvasWidth?: number
  canvasHeight?: number
  waveformColor?: string
  positiveBackgroundColor?: string
  negativeBackgroundColor?: string
}

export const WaveformStory = <T = {}>(props: Props<T>) => {
  const {
    synthTree,
    props: synthTreeProps,
    duration,
    numberOfChannels = 1,
    sampleRate = 44100,
    waveformDetails = 0.05,
    canvasWidth = 800,
    canvasHeight = 600,
    waveformColor = 'oklch(0.792 0.209 151.711)',
    positiveBackgroundColor = 'oklch(0.274 0.072 132.109)',
    negativeBackgroundColor = 'oklch(0.277 0.046 192.524)',
  } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    const drawContext = canvas?.getContext('2d')
    if (!canvas || !drawContext) {
      return
    }

    const audioBuffer = await renderAudioOffline({
      sampleRate,
      numberOfChannels,
      seconds: duration,
      audioTree: audioContext => {
        const synthContext = new SynthContext(audioContext, { lookAhead: Seconds.orThrow(0) })
        synthTree(synthContext, synthTreeProps)
        synthContext.play()
      },
    })

    drawContext.save()

    const channelLineHeight = canvas.height / numberOfChannels

    for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {
      drawContext.translate(0, channelIndex * channelLineHeight)

      drawContext.fillStyle = positiveBackgroundColor
      drawContext.fillRect(0, 0, canvas.width, channelLineHeight / 2)

      drawContext.fillStyle = negativeBackgroundColor
      drawContext.fillRect(0, channelLineHeight / 2, canvas.width, channelLineHeight / 2)

      const rawData = audioBuffer.getChannelData(channelIndex)

      const data = resample({
        data: rawData,
        samples: rawData.length * waveformDetails,
      })

      drawWaveform({
        context: drawContext,
        data,
        width: canvas.width,
        height: channelLineHeight,
        maxAmplitude: 1,
      })
    }

    drawContext.fillStyle = waveformColor
    drawContext.fill()
    drawContext.restore()
  }, [
    positiveBackgroundColor,
    negativeBackgroundColor,
    sampleRate,
    numberOfChannels,
    duration,
    synthTree,
    synthTreeProps,
    waveformDetails,
    waveformColor,
  ])

  useEffect(() => {
    render()
  }, [render])

  return (
    <div style={{ position: 'relative', height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

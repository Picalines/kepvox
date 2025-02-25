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
  backgroundColor?: string
  waveformColor?: string
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
    backgroundColor = 'oklch(0.266 0.065 152.934)',
    waveformColor = 'oklch(0.792 0.209 151.711)',
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

    drawContext.fillStyle = backgroundColor
    drawContext.fillRect(0, 0, canvas.width, canvas.height)

    const channelLineHeight = canvas.height / numberOfChannels

    for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {
      const rawData = audioBuffer.getChannelData(channelIndex)

      const data = resample({
        data: rawData,
        samples: rawData.length * waveformDetails,
        map: Math.abs,
      })

      drawContext.translate(0, channelIndex * channelLineHeight)

      drawWaveform({
        context: drawContext,
        data,
        width: canvas.width,
        height: channelLineHeight,
        minValue: 0,
        maxValue: 1,
      })
    }

    drawContext.fillStyle = waveformColor
    drawContext.fill()
    drawContext.restore()
  }, [
    backgroundColor,
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

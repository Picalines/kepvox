import { drawWaveform } from '@repo/web-audio/draw'
import { resample } from '@repo/web-audio/math'
import { renderAudioOffline } from '@repo/web-audio/offline'
import { useCallback, useEffect, useRef } from 'react'
import { SynthContext } from '#context'
import type { SynthTime } from '#time'
import { Seconds } from '#units'

type Props<T> = {
  synthTree: (synthContext: SynthContext, props: T) => void
  props: T
  duration: Seconds
  timeMarkers?: SynthTime[]
  numberOfChannels?: number
  sampleRate?: number
  waveformDetails?: number
}

const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080

const BACKGROUND_COLOR = 'oklch(0.266 0.065 152.934)'
const WAVEFORM_COLOR = 'oklch(0.792 0.209 151.711)'
const PHASE_LINE_COLOR = 'oklch(0.685 0.169 237.323)'
const TIME_MARKER_COLOR = 'oklch(0.905 0.182 98.111)'

export const WaveformStory = <T = {}>(props: Props<T>) => {
  const {
    synthTree,
    props: synthTreeProps,
    duration,
    timeMarkers: noteMakers = [],
    numberOfChannels = 1,
    sampleRate = 44100,
    waveformDetails = 0.05,
  } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    const drawContext = canvas?.getContext('2d')
    if (!canvas || !drawContext) {
      return
    }

    const secondMarkers: number[] = []

    const audioBuffer = await renderAudioOffline({
      sampleRate,
      numberOfChannels,
      seconds: duration,
      audioTree: audioContext => {
        const synthContext = new SynthContext(audioContext, { lookAhead: Seconds.orThrow(0) })
        synthTree(synthContext, synthTreeProps)
        secondMarkers.push(...noteMakers.map(time => synthContext.secondsPerNote.areaBefore(time)))
        synthContext.play()
      },
    })

    drawContext.save()

    drawContext.fillStyle = BACKGROUND_COLOR
    drawContext.fillRect(0, 0, canvas.width, canvas.height)

    drawContext.fillStyle = WAVEFORM_COLOR
    drawContext.strokeStyle = PHASE_LINE_COLOR
    drawContext.lineWidth = 2

    const channelLineHeight = canvas.height / numberOfChannels

    drawContext.save()

    for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {
      drawContext.translate(0, channelIndex * channelLineHeight)

      drawContext.beginPath()
      drawContext.moveTo(0, channelLineHeight / 2)
      drawContext.lineTo(canvas.width, channelLineHeight / 2)
      drawContext.stroke()

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

      drawContext.fill()
    }

    drawContext.restore()

    drawContext.strokeStyle = TIME_MARKER_COLOR

    for (const secondMarker of secondMarkers) {
      const markerX = (secondMarker / duration) * canvas.width
      drawContext.beginPath()
      drawContext.moveTo(markerX, 0)
      drawContext.lineTo(markerX, canvas.height)
      drawContext.stroke()
    }

    drawContext.restore()
  }, [noteMakers, sampleRate, numberOfChannels, duration, synthTree, synthTreeProps, waveformDetails])

  useEffect(() => {
    render()
  }, [render])

  return (
    <div style={{ position: 'relative', height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

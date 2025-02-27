import { assertDefined, assertTrue } from '@repo/common/assert'

type Params = {
  context: CanvasRenderingContext2D
  data: Float32Array

  width: number
  height: number

  maxAmplitude: number
}

export const drawWaveform = (params: Params) => {
  const { context, data, width, height, maxAmplitude } = params

  assertTrue(Number.isFinite(width) && width >= 0, 'invalid value of the width parameter')
  assertTrue(Number.isFinite(height) && height >= 0, 'invalid value of the height parameter')
  assertTrue(Number.isFinite(maxAmplitude) && maxAmplitude >= 0, 'invalid value of the maxAmplitude parameter')

  if (width === 0 || height === 0) {
    return
  }

  const barWidth = width / data.length
  const barZero = height / 2

  for (let barIndex = 0; barIndex < data.length; barIndex++) {
    const barLeft = barWidth * barIndex

    const barValue = data[barIndex]
    assertDefined(barValue)

    const normalizedValue = Math.min(barValue, maxAmplitude) / maxAmplitude
    const barHeight = (height * normalizedValue) / -2

    context.rect(barLeft, barZero, barWidth, barHeight)
  }
}

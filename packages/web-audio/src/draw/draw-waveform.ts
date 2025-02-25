import { assertDefined, assertTrue } from '@repo/common/assert'

type Params = {
  context: CanvasRenderingContext2D
  data: Float32Array

  width: number
  height: number

  minValue: number
  maxValue: number
}

export const drawWaveform = (params: Params) => {
  const { context, data, width, height, minValue, maxValue } = params

  assertTrue(Number.isFinite(width) && width >= 0, 'invalid value of the width parameter')
  assertTrue(Number.isFinite(height) && height >= 0, 'invalid value of the height parameter')

  if (width === 0 || height === 0) {
    return
  }

  const barWidth = width / data.length

  for (let barIndex = 0; barIndex < data.length; barIndex++) {
    const barLeft = barWidth * barIndex

    const barValue = data[barIndex]
    assertDefined(barValue)

    const normalizedValue = Math.max(0, Math.min((barValue - minValue) / (maxValue - minValue), 1))
    const barHeight = height * normalizedValue

    context.rect(barLeft, height - barHeight, barWidth, barHeight)
  }
}

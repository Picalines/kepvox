import { assertDefined, assertTrue } from '@repo/common/assert'

type Params = {
  data: Float32Array
  samples: number
  map?: (value: number) => number
}

export const resample = (params: Params): Float32Array => {
  const { data: rawData, samples, map = x => x } = params

  assertTrue(Number.isFinite(samples) && samples >= 1, 'invalid value of the samples parameter')

  const blockSize = Math.floor(rawData.length / samples)

  assertTrue(blockSize >= 1, "resample doesn't support upscaling")

  if (blockSize === 1) {
    return Float32Array.from(rawData)
  }

  const resampled = new Float32Array(samples)

  for (let sampleIndex = 0; sampleIndex < samples; sampleIndex++) {
    const blockStart = blockSize * sampleIndex

    let blockSum = 0
    for (let blockItemIndex = 0; blockItemIndex < blockSize; blockItemIndex++) {
      const blockItem = rawData[blockStart + blockItemIndex]
      assertDefined(blockItem)
      blockSum += blockItem
    }

    const average = blockSum / blockSize
    resampled[sampleIndex] = map(average)
  }

  return resampled
}

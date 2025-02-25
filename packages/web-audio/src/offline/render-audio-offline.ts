import { assertTrue } from '@repo/common/assert'

type Params = {
  audioTree: (context: OfflineAudioContext) => Promise<void> | void
  numberOfChannels: number
  seconds: number
  /**
   * @default 44100
   */
  sampleRate?: number
}

export const renderAudioOffline = async (params: Params): Promise<AudioBuffer> => {
  const { audioTree, numberOfChannels, seconds, sampleRate = 44100 } = params

  assertTrue(
    Number.isFinite(numberOfChannels) && numberOfChannels >= 1,
    'invalid value of the numberOfChannels parameter',
  )

  assertTrue(Number.isFinite(seconds) && seconds > 0, 'invalid value of the seconds parameter')

  assertTrue(Number.isFinite(sampleRate) && sampleRate > 0, 'invalid value of the sampleRate parameter')

  const context = new OfflineAudioContext({
    numberOfChannels,
    length: seconds * sampleRate,
    sampleRate,
  })

  await audioTree(context)
  const audioBufferPromise = context.startRendering()
  const audioBuffer = await audioBufferPromise

  return audioBuffer
}

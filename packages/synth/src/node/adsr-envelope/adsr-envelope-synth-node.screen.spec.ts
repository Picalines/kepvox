import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'nodes/ADSREnvelope',
  },
  stories: ['Default', 'Chained', 'Oscillator', 'NoAttack', 'NoDecay', 'NoRelease'],
})

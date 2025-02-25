import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'nodes/Oscillator',
  },
  stories: ['Default', 'Triangle', 'Sine', 'Sawtooth', 'Square', 'Limited'],
})

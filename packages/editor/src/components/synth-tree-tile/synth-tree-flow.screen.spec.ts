import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: { title: 'tiles/SynthTree' },
  stories: ['Default', 'Selected', 'Readonly'],
  themes: ['light', 'dark'],
})

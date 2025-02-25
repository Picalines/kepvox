import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'icons/Icons',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
  windowSize: { width: 600, height: 800 },
})

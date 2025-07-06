import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Icons',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
  windowSize: { width: 600, height: 800 },
})

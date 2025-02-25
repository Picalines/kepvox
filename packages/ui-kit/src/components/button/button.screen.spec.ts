import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Button',
  },
  stories: ['Primary', 'Secondary', 'Ghost', 'Outline', 'Icon'],
  themes: ['light', 'dark'],
})

import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Button',
  },
  stories: ['Primary', 'Secondary', 'Ghost', 'Outline', 'Icon'],
  themes: ['light', 'dark'],
})

import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'inputs/Button',
  },
  stories: ['Variants', 'Disabled', 'Sizes', 'Icon'],
  themes: ['light', 'dark'],
})

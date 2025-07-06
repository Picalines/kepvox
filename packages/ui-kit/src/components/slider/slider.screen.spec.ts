import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'inputs/Slider',
  },
  stories: ['Default', 'Full', 'Empty', 'NoLabel', 'Disabled'],
  themes: ['light', 'dark'],
})

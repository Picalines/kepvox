import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Slider',
  },
  stories: ['Default', 'Full', 'Empty', 'NoLabel', 'Disabled'],
  themes: ['light', 'dark'],
})

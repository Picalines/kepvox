import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Slider',
  },
  stories: ['Default', 'Full', 'Empty', 'NoLabel', 'Disabled'],
  themes: ['light', 'dark'],
})

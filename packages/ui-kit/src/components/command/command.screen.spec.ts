import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'inputs/Command',
  },
  stories: ['Default', 'DisabledInput', 'Empty'],
  themes: ['light', 'dark'],
})

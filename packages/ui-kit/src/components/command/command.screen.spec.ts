import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Command',
  },
  stories: ['Default', 'DisabledInput', 'Empty'],
  themes: ['light', 'dark'],
})

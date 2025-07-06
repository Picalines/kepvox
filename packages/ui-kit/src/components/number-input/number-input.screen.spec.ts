import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'inputs/NumberInput',
  },
  stories: ['Default', 'WithValue', 'Disabled', 'DisabledWithValue'],
  themes: ['light', 'dark'],
})

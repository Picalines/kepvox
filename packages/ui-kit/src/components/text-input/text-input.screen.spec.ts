import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/TextInput',
  },
  stories: ['Default', 'WithValue', 'Password', 'Disabled', 'DisabledWithValue'],
  themes: ['light', 'dark'],
})

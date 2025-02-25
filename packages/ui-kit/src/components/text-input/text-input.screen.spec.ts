import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/TextInput',
  },
  stories: ['Default', 'WithValue', 'Password', 'Disabled', 'DisabledWithValue'],
  themes: ['light', 'dark'],
})

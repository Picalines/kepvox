import { testStory } from '@repo/ui-test/test-story'

testStory({
  title: 'components/TextInput',
  story: ['Default', 'WithValue', 'Password', 'Disabled', 'DisabledWithValue'],
  theme: ['light', 'dark'],
})

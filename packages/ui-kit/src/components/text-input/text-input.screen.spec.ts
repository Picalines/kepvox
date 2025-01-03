import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './text-input.stories'

testStoryMatrix({
  meta,
  stories: ['Default', 'WithValue', 'Password', 'Disabled', 'DisabledWithValue'],
  themes: ['light', 'dark'],
})

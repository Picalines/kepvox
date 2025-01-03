import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './separator.stories'

testStoryMatrix({
  meta,
  stories: ['Horizontal', 'Vertical'],
  themes: ['light', 'dark'],
})

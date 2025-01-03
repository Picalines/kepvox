import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './popover.stories'

testStoryMatrix({
  meta,
  stories: ['Top', 'Left', 'Right', 'Bottom'],
  themes: ['light', 'dark'],
})

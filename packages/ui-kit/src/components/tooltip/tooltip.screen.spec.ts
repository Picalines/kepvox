import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './tooltip.stories'

testStoryMatrix({
  meta,
  stories: ['Top', 'Left', 'Right', 'Bottom', 'NoArrow'],
  themes: ['light', 'dark'],
})

import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './text.stories'

testStoryMatrix({
  meta,
  stories: ['Default'],
  themes: ['light', 'dark'],
})

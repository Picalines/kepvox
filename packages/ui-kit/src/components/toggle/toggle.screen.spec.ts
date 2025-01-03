import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './toggle.stories'

testStoryMatrix({
  meta,
  stories: ['Default'],
  themes: ['light', 'dark'],
})

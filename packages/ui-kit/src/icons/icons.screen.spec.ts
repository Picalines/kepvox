import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './icons.stories'

testStoryMatrix({
  meta,
  stories: ['Default'],
  themes: ['light', 'dark'],
  windowSize: { width: 600, height: 800 },
})

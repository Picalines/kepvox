import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './dialog.stories'

testStoryMatrix({
  meta,
  stories: ['Open'],
  themes: ['light', 'dark'],
  fullPage: true,
  windowSize: { width: 800, height: 600 },
})

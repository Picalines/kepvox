import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './resizable.stories'

testStoryMatrix({
  meta,
  stories: ['Horizontal', 'Vertical', 'TripleHorizontal', 'TripleVertical'],
  themes: ['light', 'dark'],
})

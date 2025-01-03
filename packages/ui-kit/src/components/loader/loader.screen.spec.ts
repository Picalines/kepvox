import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './loader.stories'

testStoryMatrix({
  meta,
  stories: ['Default', 'Centered'],
  themes: ['light', 'dark'],
})

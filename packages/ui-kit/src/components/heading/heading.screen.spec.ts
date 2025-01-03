import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './heading.stories'

testStoryMatrix({
  meta,
  stories: ['Default', 'NoSuperTitle', 'NoDescription', 'NoTitle'],
  themes: ['light', 'dark'],
})

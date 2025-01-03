import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './button.stories'

testStoryMatrix({
  meta,
  stories: ['Primary', 'Secondary', 'Ghost', 'Outline', 'Icon'],
  themes: ['light', 'dark'],
})

import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './checkbox.stories'

testStoryMatrix({
  meta,
  stories: ['Checked', 'Unchecked', 'CheckedAndDisabled', 'UncheckedAndDisabled'],
  themes: ['light', 'dark'],
})

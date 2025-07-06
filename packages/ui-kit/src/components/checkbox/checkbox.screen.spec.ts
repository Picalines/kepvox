import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'inputs/Checkbox',
  },
  stories: ['Checked', 'Unchecked', 'CheckedAndDisabled', 'UncheckedAndDisabled'],
  themes: ['light', 'dark'],
})

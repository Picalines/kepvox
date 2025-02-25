import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Checkbox',
  },
  stories: ['Checked', 'Unchecked', 'CheckedAndDisabled', 'UncheckedAndDisabled'],
  themes: ['light', 'dark'],
})

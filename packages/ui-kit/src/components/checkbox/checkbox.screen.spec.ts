import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Checkbox',
  },
  stories: ['Checked', 'Unchecked', 'CheckedAndDisabled', 'UncheckedAndDisabled'],
  themes: ['light', 'dark'],
})

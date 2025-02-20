import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Popover',
  },
  stories: ['Top', 'Left', 'Right', 'Bottom'],
  themes: ['light', 'dark'],
})

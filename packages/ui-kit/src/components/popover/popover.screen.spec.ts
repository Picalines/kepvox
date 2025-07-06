import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'layout/Popover',
  },
  stories: ['Top', 'Left', 'Right', 'Bottom'],
  themes: ['light', 'dark'],
})

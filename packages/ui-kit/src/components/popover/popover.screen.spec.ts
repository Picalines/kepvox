import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Popover',
  },
  stories: ['Top', 'Left', 'Right', 'Bottom'],
  themes: ['light', 'dark'],
})

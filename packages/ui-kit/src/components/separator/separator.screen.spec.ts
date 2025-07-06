import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'layout/Separator',
  },
  stories: ['Horizontal', 'Vertical'],
  themes: ['light', 'dark'],
})

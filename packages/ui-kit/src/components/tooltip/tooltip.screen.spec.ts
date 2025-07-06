import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'layout/Tooltip',
  },
  stories: ['Top', 'Left', 'Right', 'Bottom', 'NoArrow'],
  themes: ['light', 'dark'],
})

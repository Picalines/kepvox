import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Tooltip',
  },
  stories: ['Top', 'Left', 'Right', 'Bottom', 'NoArrow'],
  themes: ['light', 'dark'],
})

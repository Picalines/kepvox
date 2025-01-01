import { testStory } from '@repo/ui-test/test-story'

testStory({
  title: 'components/Tooltip',
  story: ['Top', 'Left', 'Right', 'Bottom', 'NoArrow'],
  theme: ['light', 'dark'],
})

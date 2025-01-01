import { testStory } from '@repo/ui-test/test-story'

testStory({
  title: 'components/Popover',
  story: ['Top', 'Left', 'Right', 'Bottom'],
  theme: ['light', 'dark'],
})

import { testStory } from '@repo/ui-test/test-story'

testStory({
  title: 'components/Button',
  story: ['Primary', 'Secondary', 'Ghost', 'Outline', 'Icon'],
  theme: ['light', 'dark'],
})

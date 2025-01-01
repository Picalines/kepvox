import { testStory } from '@repo/ui-test/test-story'

testStory({
  title: 'components/Heading',
  story: ['Default', 'NoSuperTitle', 'NoDescription', 'NoTitle'],
  theme: ['light', 'dark'],
})

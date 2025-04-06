import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/NodeTile',
  },
  stories: ['Default', 'Selected'],
  themes: ['light', 'dark'],
})

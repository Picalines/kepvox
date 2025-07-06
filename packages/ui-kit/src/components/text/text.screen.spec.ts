import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'typography/Text',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
